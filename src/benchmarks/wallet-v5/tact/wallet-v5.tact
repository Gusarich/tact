import "./constants";

message(0x7369676e) ExternalSignedRequest {
    walletId: Int as uint32;
    validUntil: Int as uint32;
    seqno: Int as uint32;
    outActions: Cell?;
    hasOtherActions: Bool;
    data: Slice as remaining;
}

message(0x73696e74) InternalSignedRequest {
    walletId: Int as uint32;
    validUntil: Int as uint32;
    seqno: Int as uint32;
    outActions: Cell?;
    hasOtherActions: Bool;
    data: Slice as remaining;
}

message(0x6578746e) InternalExtensionRequest {
    queryId: Int as uint64;
    actions: Slice as remaining;
}

contract WalletV5(
    isSignatureAllowed: Bool,
    seqno: Int as uint32,
    walletId: Int as int32,
    publicKey: Int as uint256,
    extensions: map<Int as uint256, Bool>,
) {
    receive(msg: InternalExtensionRequest) {
        let myAddr = parseStdAddress(myAddress().asSlice());
        let addr = parseStdAddress(sender().asSlice());

        // Before signature checking we handle errors silently (return), after signature checking we throw exceptions.
        if (addr.workchain != myAddr.workchain) {
            // throw(0) is idiom to successfully exit current continuation without saving state
            throw(0);
        }
        if (!self.extensions.exists(addr.address)) {
            throw(0);
        }

        self.processActions(msg.actions, false, true);
    }

    receive(msg: InternalSignedRequest) {
        let msgSlice = inMsg();
        let signature = msgSlice.lastBits(512);
        let signedSlice = msgSlice.skipLastBits(512);

        let isSignatureValid = checkSignature(signedSlice.hash(), signature, self.publicKey);
        if (!isSignatureValid) {
            throw(0);
        }

        throwIf(signatureDisabled, !self.isSignatureAllowed && self.extensions.isEmpty());
        throwUnless(invalidSeqno, msg.seqno == self.seqno);
        throwUnless(invalidWalletId, msg.walletId == self.walletId);
        throwIf(expired, msg.validUntil <= now());

        self.seqno += 1;
        commit();

        signedSlice.skipBits(32 + 32 + 32 + 32); // skip opcode, walletId, validUntil, seqno
        self.processActions(signedSlice, false, false);
    }

    receive(_: Slice) {
        // Fallback
    }

    external(msg: ExternalSignedRequest) {
        let msgSlice = inMsg();
        let signature = msgSlice.lastBits(512);
        let signedSlice = msgSlice.skipLastBits(512);

        let isSignatureValid = checkSignature(signedSlice.hash(), signature, self.publicKey);
        if (!isSignatureValid) {
            throw(135);
        }

        throwIf(signatureDisabled, !self.isSignatureAllowed && self.extensions.isEmpty());
        throwUnless(invalidSeqno, msg.seqno == self.seqno);
        throwUnless(invalidWalletId, msg.walletId == self.walletId);
        throwIf(expired, msg.validUntil <= now());

        acceptMessage();

        self.seqno += 1;
        setData(self.toCell());
        commit();

        signedSlice.skipBits(32 + 32 + 32 + 32); // skip opcode, walletId, validUntil, seqno
        self.processActions(signedSlice, true, false);
    }

    /// Actions has the following structure:
    ///
    /// ```tact
    /// struct Action {
    ///     outActions: Cell?;
    ///     hasOtherActions: Bool;
    ///     actions: Slice as remaining; // tl-b for ext actions
    /// }
    /// ```
    ///
    /// TL-B:
    ///
    /// ```tlb
    /// out_list_empty$_ = OutList 0;
    /// out_list$_ {n:#} prev:^(OutList n) action:OutAction = OutList (n + 1);
    /// action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;
    ///
    /// // Extended actions in W5:
    /// action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
    /// action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);
    ///
    /// action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
    /// action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
    /// action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;
    /// ```
    inline fun processActions(actions: Slice, isExternal: Bool, isExtension: Bool) {
        let outActions = actions.loadMaybeRef();
        if (outActions != null) {
            setC5(processSendMessages(outActions!!, isExternal));
        }

        if (!actions.loadBool()) {
            return;
        }

        while (true) {
            // check tag, process action, try to load next ref while we can
            let isAddExt = actions.checkAndRemoveAddExtensionPrefix();
            let isDeleteExt = isAddExt ? false : actions.checkAndRemoveDeleteExtensionPrefix();

            if (isAddExt || isDeleteExt) {
                let addr = parseStdAddress(actions.loadAddress().asSlice());
                let myAddr = parseStdAddress(myAddress().asSlice());

                throwUnless(extensionWrongWorkchain, addr.workchain == myAddr.workchain); // force_workchain optimization

                if (isAddExt) {
                    // blocked by https://github.com/tact-lang/tact/issues/2842
                    // throwUnless(139, self.extensions.add(addr.address, true));
                    throwIf(addExtension, self.extensions.exists(addr.address));
                    self.extensions.set(addr.address, true);
                } else if (isDeleteExt) {
                    throwUnless(removeExtension, self.extensions.del(addr.address));
                    throwIf(removeLastExtensionWhenSignatureDisabled, self.extensions.isEmpty() && !self.isSignatureAllowed);
                }
            } else if (actions.checkAndRemoveSetSignAllowedPrefix()) {
                throwUnless(onlyExtensionCanChangeSignatureMode, isExtension);
                let newSignMode = actions.loadBool();
                throwIf(thisSignatureModeAlreadySet, newSignMode == self.isSignatureAllowed);
                self.isSignatureAllowed = newSignMode;

                if (!self.isSignatureAllowed && self.extensions.isEmpty()) {
                    throw(disableSignatureWhenExtensionsIsEmpty);
                }
            } else {
                throw(unsupportedAction);
            }

            if (actions.refsEmpty()) {
                return;
            }

            actions = actions.preloadRef().beginParse();
        }
    }

    get fun seqno(): Int {
        return self.seqno;
    }

    get fun get_subwallet_id(): Int {
        return self.walletId;
    }

    get fun get_public_key(): Int {
        return self.publicKey;
    }

    get fun get_extensions(): map<Int as uint256, Bool> {
        return self.extensions;
    }
}

inline fun processSendMessages(outActions: Cell, isExternal: Bool): Cell {
    let cs = outActions.beginParseExotic().data;
    let count = 0;

    while (!cs.empty()) {
        cs.enforceAndRemoveActionSendMsgPrefix();

        throwUnless(invalidC5, cs.bits() == 8);
        throwUnless(invalidC5, cs.refs() == 2);
        throwIf(externalSendMessageMustHaveIgnoreErrorsSendMode, isExternal && (countTrailingZeroes(cs.preloadBits(7)) > 0));

        cs = cs.preloadRef().beginParseExotic().data;
        count += 1;
    }

    throwUnless(invalidC5, count <= 255);
    throwUnless(invalidC5, cs.refs() == 0);

    return outActions;
}

asm fun countTrailingZeroes(s: Slice): Int { SDCNTTRAIL0 }
struct SliceFlag {
    data: Slice;
    flag: Bool;
}
asm extends fun beginParseExotic(self: Cell): SliceFlag { XCTOS }
asm extends mutates fun enforceAndRemoveActionSendMsgPrefix(self: Slice) { x{0ec3c86d} SDBEGINS }
asm fun setC5(outActions: Cell) { c5 POP }

asm extends mutates fun checkAndRemoveAddExtensionPrefix(self: Slice): Bool { x{02} SDBEGINSQ }
asm extends mutates fun checkAndRemoveDeleteExtensionPrefix(self: Slice): Bool { x{03} SDBEGINSQ }
asm extends mutates fun checkAndRemoveSetSignAllowedPrefix(self: Slice): Bool { x{04} SDBEGINSQ }

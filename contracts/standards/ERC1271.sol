// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC1271 {
    function isValidSignature(
        bytes32 _hash,
        bytes memory _signature
    ) external view returns (bytes4 magicValue);
}

contract ERC1271 is IERC1271 {
    function isValidSignature(
        bytes32 _hash,
        bytes memory _signature
    ) public view override returns (bytes4 magicValue) {
        // This if you want to ensure the signature comes from a Ethereum account
        // bytes32 messageHash = keccak256(
        //     abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
        // );
        address signer = recoverSigner(_hash, _signature);
        if (signer == msg.sender) {
            return 0x20c13b0b;
        }
        return 0x00000000;
    }

    function recoverSender() public view returns (address) {
        return msg.sender;
    }

    function recoverSigner(
        bytes32 messageHash,
        bytes memory signature
    ) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        }

        return ecrecover(messageHash, v, r, s);
    }
}

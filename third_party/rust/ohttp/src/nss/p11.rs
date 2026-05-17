// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use super::err::{secstatus_to_res, Error};
use crate::err::Res;
use std::{
    convert::TryFrom,
    marker::PhantomData,
    mem,
    os::raw::{c_char, c_int, c_uchar, c_uint, c_ulong},
    ptr::null_mut,
};

#[allow(
    clippy::pedantic,
    clippy::upper_case_acronyms,
    dead_code,
    deref_nullptr,
    non_camel_case_types,
    non_snake_case,
    non_upper_case_globals
)]
mod sys_raw {
    include!(concat!(env!("OUT_DIR"), "/nss_p11.rs"));
}

pub mod sys {
    use super::{c_char, c_uchar, c_uint, c_ulong};

    pub use super::sys_raw::{
        CKA_DECRYPT, CKA_DERIVE, CKA_ENCRYPT, CKA_NSS_MESSAGE, CKA_SIGN, CKA_VALUE,
        CKF_DERIVE, CKF_HKDF_SALT_DATA, CKF_HKDF_SALT_NULL, CKG_GENERATE_COUNTER_XOR,
        CKG_NO_GENERATE, CKM_AES_GCM, CKM_CHACHA20_POLY1305, CKM_EC_KEY_PAIR_GEN,
        CKM_HKDF_DATA, CKM_HKDF_DERIVE, CKM_HKDF_KEY_GEN, CKM_INVALID_MECHANISM, CKM_SHA256,
        CK_ATTRIBUTE_TYPE, CK_BBOOL, CK_FLAGS, CK_GENERATOR_FUNCTION, CK_HKDF_PARAMS,
        CK_INVALID_HANDLE, CK_MECHANISM_TYPE, CK_OBJECT_HANDLE, CK_ULONG, HpkeAeadId,
        HpkeContext, HpkeKdfId, HpkeKemId, PK11ObjectType, PK11Origin, PK11Context,
        PK11SlotInfo, PK11SymKey, PK11_AEADOp, PK11_DestroyContext, PK11_ExtractKeyValue, PK11_FreeSlot,
        PK11_FreeSymKey, PK11_GenerateKeyPairWithOpFlags, PK11_GenerateRandom,
        PK11_GetInternalSlot, PK11_HPKE_Deserialize, PK11_HPKE_DestroyContext,
        PK11_HPKE_NewContext, PK11_HPKE_Serialize, PK11_HPKE_ValidateParameters,
        PK11_ReferenceSymKey, PK11_ATTR_INSENSITIVE, PK11_ATTR_PRIVATE, PK11_ATTR_PUBLIC,
        PK11_ATTR_SENSITIVE, PK11_ATTR_SESSION, PRBool, SEC_ASN1_OBJECT_ID,
        SECKEYPrivateKey, SECKEYPublicKey, SECKEY_CopyPrivateKey, SECKEY_CopyPublicKey,
        SECKEY_DestroyPrivateKey, SECKEY_DestroyPublicKey, SECOidTag,
    };

    pub mod SECItemType {
        pub type Type = ::std::os::raw::c_uint;
        pub const siBuffer: Type = 0;
        pub const siClearDataBuffer: Type = 1;
        pub const siCipherDataBuffer: Type = 2;
        pub const siDERCertBuffer: Type = 3;
        pub const siEncodedCertBuffer: Type = 4;
        pub const siDERNameBuffer: Type = 5;
        pub const siEncodedNameBuffer: Type = 6;
        pub const siAsciiNameString: Type = 7;
        pub const siAsciiString: Type = 8;
        pub const siDEROID: Type = 9;
        pub const siUnsignedInteger: Type = 10;
        pub const siUTCTime: Type = 11;
        pub const siGeneralizedTime: Type = 12;
        pub const siVisibleString: Type = 13;
        pub const siUTF8String: Type = 14;
        pub const siBMPString: Type = 15;
    }

    pub type SECItem = SECItemStr;

    #[repr(C)]
    #[derive(Debug, Copy, Clone)]
    pub struct SECItemStr {
        pub type_: SECItemType::Type,
        pub data: *mut c_uchar,
        pub len: c_uint,
    }

    pub mod _SECStatus {
        pub type Type = ::std::os::raw::c_int;
        pub const SECWouldBlock: Type = -2;
        pub const SECFailure: Type = -1;
        pub const SECSuccess: Type = 0;
    }

    pub use _SECStatus::*;
    pub type SECStatus = _SECStatus::Type;

    pub mod SECSupportExtenTag {
        pub type Type = ::std::os::raw::c_uint;
        pub const INVALID_CERT_EXTENSION: Type = 0;
        pub const UNSUPPORTED_CERT_EXTENSION: Type = 1;
        pub const SUPPORTED_CERT_EXTENSION: Type = 2;
    }

    pub type SECOidData = SECOidDataStr;

    #[repr(C)]
    #[derive(Debug, Copy, Clone)]
    pub struct SECOidDataStr {
        pub oid: SECItem,
        pub offset: SECOidTag::Type,
        pub desc: *const c_char,
        pub mechanism: c_ulong,
        pub supportedExtension: SECSupportExtenTag::Type,
    }

    unsafe extern "C" {
        pub fn SECITEM_FreeItem(zap: *mut SECItem, freeit: PRBool);
        pub fn PK11_GetKeyData(symKey: *mut PK11SymKey) -> *mut SECItem;
        pub fn PK11_ReadRawAttribute(
            type_: PK11ObjectType::Type,
            object: *mut ::std::os::raw::c_void,
            attr: CK_ATTRIBUTE_TYPE,
            item: *mut SECItem,
        ) -> SECStatus;
        pub fn PK11_CreateContextBySymKey(
            type_: CK_MECHANISM_TYPE,
            operation: CK_ATTRIBUTE_TYPE,
            symKey: *mut PK11SymKey,
            param: *const SECItem,
        ) -> *mut PK11Context;
        pub fn PK11_ImportSymKey(
            slot: *mut PK11SlotInfo,
            type_: CK_MECHANISM_TYPE,
            origin: PK11Origin::Type,
            operation: CK_ATTRIBUTE_TYPE,
            key: *mut SECItem,
            wincx: *mut ::std::os::raw::c_void,
        ) -> *mut PK11SymKey;
        pub fn PK11_Derive(
            baseKey: *mut PK11SymKey,
            derive: CK_MECHANISM_TYPE,
            param: *mut SECItem,
            target: CK_MECHANISM_TYPE,
            operation: CK_ATTRIBUTE_TYPE,
            keySize: ::std::os::raw::c_int,
        ) -> *mut PK11SymKey;
        pub fn SECOID_FindOIDByTag(tagnum: SECOidTag::Type) -> *mut SECOidData;
        pub fn PK11_HPKE_GetEncapPubKey(cx: *mut HpkeContext) -> *const SECItem;
        pub fn PK11_HPKE_ExportSecret(
            cx: *mut HpkeContext,
            info: *const SECItem,
            len: c_uint,
            out: *mut *mut PK11SymKey,
        ) -> SECStatus;
        pub fn PK11_HPKE_SetupS(
            cx: *mut HpkeContext,
            pkE: *mut SECKEYPublicKey,
            skE: *mut SECKEYPrivateKey,
            pkR: *mut SECKEYPublicKey,
            info: *const SECItem,
        ) -> SECStatus;
        pub fn PK11_HPKE_SetupR(
            cx: *mut HpkeContext,
            pkR: *mut SECKEYPublicKey,
            skR: *mut SECKEYPrivateKey,
            enc: *const SECItem,
            info: *const SECItem,
        ) -> SECStatus;
        pub fn PK11_HPKE_Seal(
            cx: *mut HpkeContext,
            aad: *const SECItem,
            pt: *const SECItem,
            out: *mut *mut SECItem,
        ) -> SECStatus;
        pub fn PK11_HPKE_Open(
            cx: *mut HpkeContext,
            aad: *const SECItem,
            ct: *const SECItem,
            out: *mut *mut SECItem,
        ) -> SECStatus;
    }
}

use sys::{
    PK11ObjectType, PK11SlotInfo, PK11SymKey, PK11_ExtractKeyValue, PK11_FreeSlot,
    PK11_FreeSymKey, PK11_GenerateRandom, PK11_GetInternalSlot, PK11_GetKeyData,
    PK11_ReadRawAttribute, PK11_ReferenceSymKey, PRBool, SECITEM_FreeItem, SECItem,
    SECItemType, SECKEYPrivateKey, SECKEYPublicKey, SECKEY_DestroyPrivateKey,
    SECKEY_DestroyPublicKey, CKA_VALUE, CK_ATTRIBUTE_TYPE,
};

macro_rules! scoped_ptr {
    ($scoped:ident, $target:ty, $dtor:path) => {
        pub struct $scoped {
            ptr: *mut $target,
        }

        impl $scoped {
            pub fn from_ptr(ptr: *mut $target) -> Result<Self, crate::err::Error> {
                if ptr.is_null() {
                    Err(crate::nss::err::Error::last())
                } else {
                    Ok(Self { ptr })
                }
            }
        }

        impl std::ops::Deref for $scoped {
            type Target = *mut $target;
            #[must_use]
            fn deref(&self) -> &*mut $target {
                &self.ptr
            }
        }

        impl std::ops::DerefMut for $scoped {
            fn deref_mut(&mut self) -> &mut *mut $target {
                &mut self.ptr
            }
        }

        impl Drop for $scoped {
            fn drop(&mut self) {
                unsafe { $dtor(self.ptr) };
            }
        }
    };
}

scoped_ptr!(PrivateKey, SECKEYPrivateKey, SECKEY_DestroyPrivateKey);

impl PrivateKey {
    pub fn key_data(&self) -> Res<Vec<u8>> {
        let mut key_item = SECItem {
            type_: SECItemType::siBuffer,
            data: null_mut(),
            len: 0,
        };
        secstatus_to_res(unsafe {
            PK11_ReadRawAttribute(
                PK11ObjectType::PK11_TypePrivKey,
                (**self).cast(),
                CK_ATTRIBUTE_TYPE::from(CKA_VALUE),
                &mut key_item,
            )
        })?;
        let slc = unsafe {
            std::slice::from_raw_parts(key_item.data, usize::try_from(key_item.len).unwrap())
        };
        let key = Vec::from(slc);
        // The data that `key_item` refers to needs to be freed, but we can't
        // use the scoped `Item` implementation.  This is OK as long as nothing
        // panics between `PK11_ReadRawAttribute` succeeding and here.
        unsafe {
            SECITEM_FreeItem(&mut key_item, PRBool::from(false));
        }
        Ok(key)
    }
}
unsafe impl Send for PrivateKey {}

impl Clone for PrivateKey {
    #[must_use]
    fn clone(&self) -> Self {
        let ptr = unsafe { sys::SECKEY_CopyPrivateKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl std::fmt::Debug for PrivateKey {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        if let Ok(b) = self.key_data() {
            write!(f, "PrivateKey {}", hex::encode(b))
        } else {
            write!(f, "Opaque PrivateKey")
        }
    }
}

scoped_ptr!(PublicKey, SECKEYPublicKey, SECKEY_DestroyPublicKey);

impl PublicKey {
    /// Get the HPKE serialization of the public key.
    pub fn key_data(&self) -> Res<Vec<u8>> {
        let mut buf = vec![0; 100];
        let mut len: c_uint = 0;
        secstatus_to_res(unsafe {
            sys::PK11_HPKE_Serialize(
                **self,
                buf.as_mut_ptr(),
                &mut len,
                c_uint::try_from(buf.len()).unwrap(),
            )
        })?;
        buf.truncate(usize::try_from(len).unwrap());
        Ok(buf)
    }
}

unsafe impl Send for PublicKey {}

impl Clone for PublicKey {
    #[must_use]
    fn clone(&self) -> Self {
        let ptr = unsafe { sys::SECKEY_CopyPublicKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl std::fmt::Debug for PublicKey {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        if let Ok(b) = self.key_data() {
            write!(f, "PublicKey {}", hex::encode(b))
        } else {
            write!(f, "Opaque PublicKey")
        }
    }
}

scoped_ptr!(Slot, PK11SlotInfo, PK11_FreeSlot);

impl Slot {
    pub(crate) fn internal() -> Res<Self> {
        let p = unsafe { PK11_GetInternalSlot() };
        Slot::from_ptr(p)
    }
}

scoped_ptr!(SymKey, PK11SymKey, PK11_FreeSymKey);

impl SymKey {
    /// You really don't want to use this.
    ///
    /// # Errors
    /// Some keys cannot be inspected in this way.
    /// Also, internal errors in case of failures in NSS.
    pub fn key_data(&self) -> Res<&[u8]> {
        secstatus_to_res(unsafe { PK11_ExtractKeyValue(self.ptr) })?;

        let key_item = unsafe { PK11_GetKeyData(self.ptr) };
        // This is accessing a value attached to the key, so we can treat this as a borrow.
        match unsafe { key_item.as_mut() } {
            None => Err(Error::last()),
            Some(key) => Ok(unsafe { std::slice::from_raw_parts(key.data, key.len as usize) }),
        }
    }
}

impl Clone for SymKey {
    #[must_use]
    fn clone(&self) -> Self {
        let ptr = unsafe { PK11_ReferenceSymKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl std::fmt::Debug for SymKey {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        if let Ok(b) = self.key_data() {
            write!(f, "SymKey {}", hex::encode(b))
        } else {
            write!(f, "Opaque SymKey")
        }
    }
}

unsafe impl Send for SymKey {}

/// Generate a randomized buffer.
#[must_use]
pub fn random(size: usize) -> Vec<u8> {
    let mut buf = vec![0; size];
    secstatus_to_res(unsafe {
        PK11_GenerateRandom(buf.as_mut_ptr(), c_int::try_from(buf.len()).unwrap())
    })
    .unwrap();
    buf
}

pub(crate) struct ParamItem<'a, T: 'a> {
    item: SECItem,
    marker: PhantomData<&'a T>,
}

impl<'a, T: Sized + 'a> ParamItem<'a, T> {
    pub fn new(v: &'a mut T) -> Self {
        let item = SECItem {
            type_: SECItemType::siBuffer,
            data: (v as *mut T).cast::<u8>(),
            len: c_uint::try_from(mem::size_of::<T>()).unwrap(),
        };
        Self {
            item,
            marker: PhantomData,
        }
    }

    pub fn ptr(&mut self) -> *mut SECItem {
        std::ptr::addr_of_mut!(self.item)
    }
}

unsafe fn destroy_secitem(item: *mut SECItem) {
    SECITEM_FreeItem(item, PRBool::from(true));
}
scoped_ptr!(Item, SECItem, destroy_secitem);

impl Item {
    /// Create a wrapper for a slice of this object.
    /// Creating this object is technically safe, but using it is extremely dangerous.
    /// Minimally, it can only be passed as a `const SECItem*` argument to functions.
    pub(crate) fn wrap(buf: &[u8]) -> SECItem {
        SECItem {
            type_: SECItemType::siBuffer,
            data: buf.as_ptr() as *mut u8,
            len: c_uint::try_from(buf.len()).unwrap(),
        }
    }

    /// This dereferences the pointer held by the item and makes a copy of the
    /// content that is referenced there.
    ///
    /// # Safety
    /// This dereferences two pointers.  It doesn't get much less safe.
    pub(crate) unsafe fn into_vec(self) -> Vec<u8> {
        let b = self.ptr.as_ref().unwrap();
        // Sanity check the type, as some types don't count bytes in `Item::len`.
        assert_eq!(b.type_, SECItemType::siBuffer);
        let slc = std::slice::from_raw_parts(b.data, usize::try_from(b.len).unwrap());
        Vec::from(slc)
    }
}

#[cfg(test)]
mod test {
    use super::random;
    use crate::init;

    #[test]
    fn randomness() {
        init();
        // If this ever fails, there is either a bug, or it's time to buy a lottery ticket.
        assert_ne!(random(16), random(16));
    }
}

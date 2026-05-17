// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::{
    cell::RefCell,
    fmt::{self, Debug, Formatter},
    mem::size_of,
    ops::{Deref, DerefMut},
    os::raw::{c_char, c_uchar, c_uint, c_ulong},
    ptr::null_mut,
    slice::Iter as SliceIter,
};

use neqo_common::hex_with_len;

use crate::{
    err::{secstatus_to_res, Error, Res},
    null_safe_slice,
};

#[expect(
    dead_code,
    non_snake_case,
    non_upper_case_globals,
    non_camel_case_types,
    clippy::unreadable_literal,
    reason = "For included bindgen code."
)]
mod nss_p11_raw {
    include!(concat!(env!("OUT_DIR"), "/nss_p11.rs"));
}

pub use nss_p11_raw::{
    CERTCertificate, CERT_DestroyCertificate, CKA_DERIVE, CKA_ENCRYPT, CKA_VALUE,
    CKF_DERIVE, CKM_AES_ECB, CKM_AES_GCM, CKM_CHACHA20, CKM_CHACHA20_POLY1305,
    CKM_EC_KEY_PAIR_GEN, CKM_HKDF_DERIVE, CKM_INVALID_MECHANISM, CK_ATTRIBUTE_TYPE,
    CK_CHACHA20_PARAMS, CK_FLAGS, CK_MECHANISM_TYPE, HpkeAeadId, HpkeKdfId, HpkeKemId,
    NSS_USE_ALG_IN_SSL_KX, PK11Origin, PK11ObjectType, PK11Context, PK11SlotInfo, PK11SymKey,
    PK11_ATTR_INSENSITIVE, PK11_ATTR_PRIVATE, PK11_ATTR_PUBLIC, PK11_ATTR_SENSITIVE, PK11_ATTR_SESSION,
    PK11_CipherOp, PK11_DestroyContext, PK11_ExtractKeyValue, PK11_FindCertFromNickname,
    PK11_FindKeyByAnyCert, PK11_FreeSlot, PK11_FreeSymKey, PK11_GenerateKeyPairWithOpFlags,
    PK11_GenerateRandom, PK11_GetInternalSlot, PK11_GetMechanism, PK11_HPKE_Serialize,
    PK11_ReferenceSymKey, PRBool, PRIntn, PRUint32, PRUint8, SEC_ASN1_OBJECT_ID,
    SECKEYPrivateKey, SECKEYPublicKey,
    SECKEY_CopyPrivateKey, SECKEY_CopyPublicKey, SECKEY_DestroyPrivateKey,
    SECKEY_DestroyPublicKey, SECOidTag,
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

pub type SECItemArray = SECItemArrayStr;

#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub struct SECItemArrayStr {
    pub items: *mut SECItem,
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
    pub fn SECITEM_FreeArray(array: *mut SECItemArray, freeit: PRBool);
    pub fn SECOID_FindOIDByTag(tagnum: SECOidTag::Type) -> *mut SECOidData;
    pub fn PK11_ImportDataKey(
        slot: *mut PK11SlotInfo,
        type_: CK_MECHANISM_TYPE,
        origin: PK11Origin::Type,
        operation: CK_ATTRIBUTE_TYPE,
        key: *mut SECItem,
        wincx: *mut ::std::os::raw::c_void,
    ) -> *mut PK11SymKey;
    pub fn PK11_GetBlockSize(type_: CK_MECHANISM_TYPE, params: *mut SECItem) -> ::std::os::raw::c_int;
    pub fn PK11_GetKeyData(symKey: *mut PK11SymKey) -> *mut SECItem;
    pub fn PK11_Encrypt(
        symKey: *mut PK11SymKey,
        mechanism: CK_MECHANISM_TYPE,
        param: *mut SECItem,
        out: *mut c_uchar,
        outLen: *mut c_uint,
        maxLen: c_uint,
        data: *const c_uchar,
        dataLen: c_uint,
    ) -> SECStatus;
    pub fn PK11_CreateContextBySymKey(
        type_: CK_MECHANISM_TYPE,
        operation: CK_ATTRIBUTE_TYPE,
        symKey: *mut PK11SymKey,
        param: *const SECItem,
    ) -> *mut PK11Context;
    pub fn PK11_ReadRawAttribute(
        type_: PK11ObjectType::Type,
        object: *mut ::std::os::raw::c_void,
        attr: CK_ATTRIBUTE_TYPE,
        item: *mut SECItem,
    ) -> SECStatus;
}

#[macro_export]
macro_rules! scoped_ptr {
    ($scoped:ident, $target:ty, $dtor:path) => {
        pub struct $scoped {
            ptr: *mut $target,
        }

        impl $scoped {
            /// Create a new instance of `$scoped` from a pointer.
            ///
            /// # Errors
            ///
            /// When passed a null pointer generates an error.
            #[allow(
                clippy::allow_attributes,
                dead_code,
                reason = "False positive; is used in code calling the macro."
            )]
            pub fn from_ptr(ptr: *mut $target) -> Result<Self, $crate::err::Error> {
                if ptr.is_null() {
                    Err($crate::err::Error::last_nss_error())
                } else {
                    Ok(Self { ptr })
                }
            }
        }

        impl Deref for $scoped {
            type Target = *mut $target;
            fn deref(&self) -> &*mut $target {
                &self.ptr
            }
        }

        impl DerefMut for $scoped {
            fn deref_mut(&mut self) -> &mut *mut $target {
                &mut self.ptr
            }
        }

        impl Drop for $scoped {
            fn drop(&mut self) {
                unsafe { _ = $dtor(self.ptr) };
            }
        }
    };
}

scoped_ptr!(Certificate, CERTCertificate, CERT_DestroyCertificate);
scoped_ptr!(PublicKey, SECKEYPublicKey, SECKEY_DestroyPublicKey);

impl PublicKey {
    /// Get the HPKE serialization of the public key.
    ///
    /// # Errors
    ///
    /// When the key cannot be exported, which can be because the type is not supported.
    ///
    /// # Panics
    ///
    /// When keys are too large to fit in `c_uint/usize`.  So only on programming error.
    pub fn key_data(&self) -> Res<Vec<u8>> {
        let mut buf = vec![0; 100];
        let mut len: c_uint = 0;
        secstatus_to_res(unsafe {
            PK11_HPKE_Serialize(
                **self,
                buf.as_mut_ptr(),
                &mut len,
                c_uint::try_from(buf.len())?,
            )
        })?;
        buf.truncate(usize::try_from(len)?);
        Ok(buf)
    }
}

impl Clone for PublicKey {
    fn clone(&self) -> Self {
        let ptr = unsafe { SECKEY_CopyPublicKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl Debug for PublicKey {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if let Ok(b) = self.key_data() {
            write!(f, "PublicKey {}", hex_with_len(b))
        } else {
            write!(f, "Opaque PublicKey")
        }
    }
}

scoped_ptr!(PrivateKey, SECKEYPrivateKey, SECKEY_DestroyPrivateKey);

impl PrivateKey {
    /// Get the bits of the private key.
    ///
    /// # Errors
    ///
    /// When the key cannot be exported, which can be because the type is not supported
    /// or because the key data cannot be extracted from the PKCS#11 module.
    ///
    /// # Panics
    ///
    /// When the values are too large to fit.  So never.
    pub fn key_data(&self) -> Res<Vec<u8>> {
        let mut key_item = Item::make_empty();
        secstatus_to_res(unsafe {
            PK11_ReadRawAttribute(
                PK11ObjectType::PK11_TypePrivKey,
                (**self).cast(),
                CK_ATTRIBUTE_TYPE::from(CKA_VALUE),
                &mut key_item,
            )
        })?;
        let slc = unsafe { null_safe_slice(key_item.data, key_item.len) };
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
    fn clone(&self) -> Self {
        let ptr = unsafe { SECKEY_CopyPrivateKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl Debug for PrivateKey {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if let Ok(b) = self.key_data() {
            write!(f, "PrivateKey {}", hex_with_len(b))
        } else {
            write!(f, "Opaque PrivateKey")
        }
    }
}

scoped_ptr!(Slot, PK11SlotInfo, PK11_FreeSlot);

impl Slot {
    pub fn internal() -> Res<Self> {
        let p = unsafe { PK11_GetInternalSlot() };
        Self::from_ptr(p)
    }
}

scoped_ptr!(SymKey, PK11SymKey, PK11_FreeSymKey);

impl SymKey {
    /// You really don't want to use this.
    ///
    /// # Errors
    ///
    /// Internal errors in case of failures in NSS.
    pub fn as_bytes(&self) -> Res<&[u8]> {
        secstatus_to_res(unsafe { PK11_ExtractKeyValue(self.ptr) })?;

        let key_item = unsafe { PK11_GetKeyData(self.ptr) };
        // This is accessing a value attached to the key, so we can treat this as a borrow.
        match unsafe { key_item.as_mut() } {
            None => Err(Error::InternalError),
            Some(key) => Ok(unsafe { null_safe_slice(key.data, key.len) }),
        }
    }
}

impl Clone for SymKey {
    fn clone(&self) -> Self {
        let ptr = unsafe { PK11_ReferenceSymKey(self.ptr) };
        assert!(!ptr.is_null());
        Self { ptr }
    }
}

impl Debug for SymKey {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if let Ok(b) = self.as_bytes() {
            write!(f, "SymKey {}", hex_with_len(b))
        } else {
            write!(f, "Opaque SymKey")
        }
    }
}

impl Default for SymKey {
    fn default() -> Self {
        Self { ptr: null_mut() }
    }
}

unsafe fn destroy_pk11_context(ctxt: *mut PK11Context) {
    PK11_DestroyContext(ctxt, PRBool::from(true));
}
scoped_ptr!(Context, PK11Context, destroy_pk11_context);

unsafe fn destroy_secitem(item: *mut SECItem) {
    SECITEM_FreeItem(item, PRBool::from(true));
}
scoped_ptr!(Item, SECItem, destroy_secitem);

impl AsRef<[u8]> for SECItem {
    fn as_ref(&self) -> &[u8] {
        unsafe { null_safe_slice(self.data, self.len) }
    }
}

impl Item {
    /// Create a wrapper for a slice of this object.
    /// Creating this object is technically safe, but using it is extremely dangerous.
    /// Minimally, it can only be passed as a `const SECItem*` argument to functions,
    /// or those that treat their argument as `const`.
    pub fn wrap(buf: &[u8]) -> Res<SECItem> {
        Ok(SECItem {
            type_: SECItemType::siBuffer,
            data: buf.as_ptr().cast_mut(),
            len: c_uint::try_from(buf.len())?,
        })
    }

    /// Create a wrapper for a struct.
    /// Creating this object is technically safe, but using it is extremely dangerous.
    /// Minimally, it can only be passed as a `const SECItem*` argument to functions,
    /// or those that treat their argument as `const`.
    pub fn wrap_struct<T>(v: &T) -> Res<SECItem> {
        let data: *const T = v;
        Ok(SECItem {
            type_: SECItemType::siBuffer,
            data: data.cast_mut().cast(),
            len: c_uint::try_from(size_of::<T>())?,
        })
    }

    /// Make an empty `SECItem` for passing as a mutable `SECItem*` argument.
    pub const fn make_empty() -> SECItem {
        SECItem {
            type_: SECItemType::siBuffer,
            data: null_mut(),
            len: 0,
        }
    }
}

unsafe fn destroy_secitem_array(array: *mut SECItemArray) {
    SECITEM_FreeArray(array, PRBool::from(true));
}
scoped_ptr!(ItemArray, SECItemArray, destroy_secitem_array);

impl<'a> IntoIterator for &'a ItemArray {
    type Item = &'a [u8];
    type IntoIter = ItemArrayIterator<'a>;
    fn into_iter(self) -> Self::IntoIter {
        Self::IntoIter {
            iter: AsRef::<[SECItem]>::as_ref(self).iter(),
        }
    }
}

impl AsRef<[SECItem]> for ItemArray {
    fn as_ref(&self) -> &[SECItem] {
        unsafe { null_safe_slice((*self.ptr).items, (*self.ptr).len) }
    }
}

pub struct ItemArrayIterator<'a> {
    iter: SliceIter<'a, SECItem>,
}

impl<'a> Iterator for ItemArrayIterator<'a> {
    type Item = &'a [u8];
    fn next(&mut self) -> Option<&'a [u8]> {
        self.iter.next().map(AsRef::<[u8]>::as_ref)
    }
}

#[cfg(feature = "disable-random")]
thread_local! {
    static CURRENT_VALUE: std::cell::Cell<u8> = const { std::cell::Cell::new(0) };
}

#[cfg(feature = "disable-random")]
/// Fill a buffer with a predictable sequence of bytes.
pub fn randomize<B: AsMut<[u8]>>(mut buf: B) -> B {
    let m_buf = buf.as_mut();
    for v in m_buf.iter_mut() {
        *v = CURRENT_VALUE.get();
        CURRENT_VALUE.set(v.wrapping_add(1));
    }
    buf
}

/// Fill a buffer with randomness.
///
/// # Panics
///
/// When `size` is too large or NSS fails.
#[cfg(not(feature = "disable-random"))]
pub fn randomize<B: AsMut<[u8]>>(mut buf: B) -> B {
    let m_buf = buf.as_mut();
    let len = std::os::raw::c_int::try_from(m_buf.len()).expect("usize fits into c_int");
    secstatus_to_res(unsafe { PK11_GenerateRandom(m_buf.as_mut_ptr(), len) }).expect("NSS failed");
    buf
}

struct RandomCache {
    cache: [u8; Self::SIZE],
    used: usize,
}

impl RandomCache {
    const SIZE: usize = 256;
    const CUTOFF: usize = 32;

    const fn new() -> Self {
        Self {
            cache: [0; Self::SIZE],
            used: Self::SIZE,
        }
    }

    fn randomize<B: AsMut<[u8]>>(&mut self, mut buf: B) -> B {
        let m_buf = buf.as_mut();
        debug_assert!(m_buf.len() <= Self::CUTOFF);
        let avail = Self::SIZE - self.used;
        if m_buf.len() <= avail {
            m_buf.copy_from_slice(&self.cache[self.used..self.used + m_buf.len()]);
            self.used += m_buf.len();
        } else {
            if avail > 0 {
                m_buf[..avail].copy_from_slice(&self.cache[self.used..]);
            }
            randomize(&mut self.cache[..]);
            self.used = m_buf.len() - avail;
            m_buf[avail..].copy_from_slice(&self.cache[..self.used]);
        }
        buf
    }
}

/// Generate a randomized array.
///
/// # Panics
///
/// When `size` is too large or NSS fails.
#[must_use]
pub fn random<const N: usize>() -> [u8; N] {
    thread_local!(static CACHE: RefCell<RandomCache> = const { RefCell::new(RandomCache::new()) });

    let buf = [0; N];
    if N <= RandomCache::CUTOFF {
        CACHE.with_borrow_mut(|c| c.randomize(buf))
    } else {
        randomize(buf)
    }
}

#[cfg(test)]
mod test {
    use test_fixture::fixture_init;

    use super::RandomCache;
    use crate::random;

    #[cfg(not(feature = "disable-random"))]
    #[test]
    fn randomness() {
        use crate::randomize;

        fixture_init();
        // If any of these ever fail, there is either a bug, or it's time to buy a lottery ticket.
        assert_ne!(random::<16>(), randomize([0; 16]));
        assert_ne!([0; 16], random::<16>());
        assert_ne!([0; 64], random::<64>());
    }

    #[test]
    fn cache_random_lengths() {
        const ZERO: [u8; 256] = [0; 256];

        fixture_init();
        let mut cache = RandomCache::new();
        let mut buf = [0; 256];
        let bits = usize::BITS - (RandomCache::CUTOFF - 1).leading_zeros();
        let mask = 0xff >> (u8::BITS - bits);

        for _ in 0..100 {
            let len = loop {
                let len = usize::from(random::<1>()[0] & mask) + 1;
                if len <= RandomCache::CUTOFF {
                    break len;
                }
            };
            buf.fill(0);
            if len >= 16 {
                assert_ne!(&cache.randomize(&mut buf[..len])[..len], &ZERO[..len]);
            }
        }
    }
}

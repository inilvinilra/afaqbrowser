// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

#![allow(dead_code, non_upper_case_globals, non_snake_case)]

use std::os::raw::{c_char, c_int, c_uint, c_void};

pub const PR_AF_INET: u32 = 2;

pub type PRUint16 = u16;
pub type PRUint32 = u32;
pub type PRInt16 = i16;
pub type PRInt32 = i32;
pub type PRInt64 = i64;
pub type PRIntn = c_int;
pub type PRUintn = c_uint;
pub type PRBool = PRIntn;
pub type PRSize = usize;
pub type PROffset32 = PRInt32;
pub type PROffset64 = PRInt64;
pub type PRIntervalTime = PRUint32;
pub type PRDescIdentity = PRIntn;

pub mod PRStatus {
    pub type Type = ::std::os::raw::c_int;
    pub const PR_FAILURE: Type = -1;
    pub const PR_SUCCESS: Type = 0;
}

pub mod PRSockOption {
    pub type Type = ::std::os::raw::c_uint;
    pub const PR_SockOpt_Nonblocking: Type = 0;
    pub const PR_SockOpt_Linger: Type = 1;
    pub const PR_SockOpt_Reuseaddr: Type = 2;
    pub const PR_SockOpt_Keepalive: Type = 3;
    pub const PR_SockOpt_RecvBufferSize: Type = 4;
    pub const PR_SockOpt_SendBufferSize: Type = 5;
    pub const PR_SockOpt_IpTimeToLive: Type = 6;
    pub const PR_SockOpt_IpTypeOfService: Type = 7;
    pub const PR_SockOpt_AddMember: Type = 8;
    pub const PR_SockOpt_DropMember: Type = 9;
    pub const PR_SockOpt_McastInterface: Type = 10;
    pub const PR_SockOpt_McastTimeToLive: Type = 11;
    pub const PR_SockOpt_McastLoopback: Type = 12;
    pub const PR_SockOpt_NoDelay: Type = 13;
    pub const PR_SockOpt_MaxSegment: Type = 14;
    pub const PR_SockOpt_Broadcast: Type = 15;
    pub const PR_SockOpt_Reuseport: Type = 16;
    pub const PR_SockOpt_DontFrag: Type = 17;
    pub const PR_SockOpt_Last: Type = 18;
}

pub mod PRDescType {
    pub type Type = ::std::os::raw::c_uint;
    pub const PR_DESC_FILE: Type = 1;
    pub const PR_DESC_SOCKET_TCP: Type = 2;
    pub const PR_DESC_SOCKET_UDP: Type = 3;
    pub const PR_DESC_LAYERED: Type = 4;
    pub const PR_DESC_PIPE: Type = 5;
}

pub mod PRSeekWhence {
    pub type Type = ::std::os::raw::c_uint;
    pub const PR_SEEK_SET: Type = 0;
    pub const PR_SEEK_CUR: Type = 1;
    pub const PR_SEEK_END: Type = 2;
}

pub mod PRTransmitFileFlags {
    pub type Type = ::std::os::raw::c_uint;
    pub const PR_TRANSMITFILE_KEEP_OPEN: Type = 0;
    pub const PR_TRANSMITFILE_CLOSE_SOCKET: Type = 1;
}

#[repr(C)]
pub struct PRFileInfo {
    _unused: [u8; 0],
}

#[repr(C)]
pub struct PRFileInfo64 {
    _unused: [u8; 0],
}

#[repr(C)]
pub struct PRFilePrivate {
    _unused: [u8; 0],
}

#[repr(C)]
pub struct PRIOVec {
    _unused: [u8; 0],
}

#[repr(C)]
pub struct PRSendFileData {
    _unused: [u8; 0],
}

#[repr(C)]
#[derive(Copy, Clone)]
pub union PRIPv6AddrUnion {
    pub _S6_u8: [u8; 16],
    pub _S6_u16: [u16; 8],
    pub _S6_u32: [u32; 4],
    pub _S6_u64: [u64; 2],
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRIPv6Addr {
    pub _S6_un: PRIPv6AddrUnion,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRNetAddrRaw {
    pub family: PRUint16,
    pub data: [c_char; 14],
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRNetAddrInet {
    pub family: PRUint16,
    pub port: PRUint16,
    pub ip: PRUint32,
    pub pad: [c_char; 8],
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRNetAddrIpv6 {
    pub family: PRUint16,
    pub port: PRUint16,
    pub flowinfo: PRUint32,
    pub ip: PRIPv6Addr,
    pub scope_id: PRUint32,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRNetAddrLocal {
    pub family: PRUint16,
    pub path: [c_char; 104],
}

#[repr(C)]
#[derive(Copy, Clone)]
pub union PRNetAddr {
    pub raw: PRNetAddrRaw,
    pub inet: PRNetAddrInet,
    pub ipv6: PRNetAddrIpv6,
    pub local: PRNetAddrLocal,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRLinger {
    pub polarity: PRBool,
    pub linger: PRIntervalTime,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRMcastRequest {
    pub mcaddr: PRNetAddr,
    pub ifaddr: PRNetAddr,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub union PRSocketOptionValue {
    pub ip_ttl: PRUintn,
    pub mcast_ttl: PRUintn,
    pub tos: PRUintn,
    pub non_blocking: PRBool,
    pub reuse_addr: PRBool,
    pub reuse_port: PRBool,
    pub dont_fragment: PRBool,
    pub keep_alive: PRBool,
    pub mcast_loopback: PRBool,
    pub no_delay: PRBool,
    pub broadcast: PRBool,
    pub max_segment: PRSize,
    pub recv_buffer_size: PRSize,
    pub send_buffer_size: PRSize,
    pub linger: PRLinger,
    pub add_member: PRMcastRequest,
    pub drop_member: PRMcastRequest,
    pub mcast_if: PRNetAddr,
}

#[repr(C)]
#[derive(Copy, Clone)]
pub struct PRSocketOptionData {
    pub option: PRSockOption::Type,
    pub value: PRSocketOptionValue,
}

pub type PRFileDescDtor = Option<unsafe extern "C" fn(fd: *mut PRFileDesc)>;
pub type PRCloseFN = Option<unsafe extern "C" fn(fd: *mut PRFileDesc) -> PRStatus::Type>;
pub type PRReadFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, buf: *mut c_void, amount: PRInt32) -> PRInt32>;
pub type PRWriteFN = Option<
    unsafe extern "C" fn(fd: *mut PRFileDesc, buf: *const c_void, amount: PRInt32) -> PRInt32,
>;
pub type PRAvailableFN = Option<unsafe extern "C" fn(fd: *mut PRFileDesc) -> PRInt32>;
pub type PRAvailable64FN = Option<unsafe extern "C" fn(fd: *mut PRFileDesc) -> PRInt64>;
pub type PRFsyncFN = Option<unsafe extern "C" fn(fd: *mut PRFileDesc) -> PRStatus::Type>;
pub type PRSeekFN = Option<
    unsafe extern "C" fn(fd: *mut PRFileDesc, offset: PROffset32, how: PRSeekWhence::Type) -> PROffset32,
>;
pub type PRSeek64FN = Option<
    unsafe extern "C" fn(fd: *mut PRFileDesc, offset: PROffset64, how: PRSeekWhence::Type) -> PROffset64,
>;
pub type PRFileInfoFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, info: *mut PRFileInfo) -> PRStatus::Type>;
pub type PRFileInfo64FN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, info: *mut PRFileInfo64) -> PRStatus::Type>;
pub type PRWritevFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        iov: *const PRIOVec,
        iov_size: PRInt32,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRConnectFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        addr: *const PRNetAddr,
        timeout: PRIntervalTime,
    ) -> PRStatus::Type,
>;
pub type PRAcceptFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        addr: *mut PRNetAddr,
        timeout: PRIntervalTime,
    ) -> *mut PRFileDesc,
>;
pub type PRBindFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, addr: *const PRNetAddr) -> PRStatus::Type>;
pub type PRListenFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, backlog: PRIntn) -> PRStatus::Type>;
pub type PRShutdownFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, how: PRIntn) -> PRStatus::Type>;
pub type PRRecvFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        buf: *mut c_void,
        amount: PRInt32,
        flags: PRIntn,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRSendFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        buf: *const c_void,
        amount: PRInt32,
        flags: PRIntn,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRRecvfromFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        buf: *mut c_void,
        amount: PRInt32,
        flags: PRIntn,
        addr: *mut PRNetAddr,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRSendtoFN = Option<
    unsafe extern "C" fn(
        fd: *mut PRFileDesc,
        buf: *const c_void,
        amount: PRInt32,
        flags: PRIntn,
        addr: *const PRNetAddr,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRPollFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, in_flags: PRInt16, out_flags: *mut PRInt16) -> PRInt16>;
pub type PRAcceptreadFN = Option<
    unsafe extern "C" fn(
        sd: *mut PRFileDesc,
        nd: *mut *mut PRFileDesc,
        raddr: *mut *mut PRNetAddr,
        buf: *mut c_void,
        amount: PRInt32,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRTransmitfileFN = Option<
    unsafe extern "C" fn(
        sd: *mut PRFileDesc,
        fd: *mut PRFileDesc,
        headers: *const c_void,
        hlen: PRInt32,
        flags: PRTransmitFileFlags::Type,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRGetsocknameFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, addr: *mut PRNetAddr) -> PRStatus::Type>;
pub type PRGetpeernameFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, addr: *mut PRNetAddr) -> PRStatus::Type>;
pub type PRGetsocketoptionFN = Option<
    unsafe extern "C" fn(fd: *mut PRFileDesc, data: *mut PRSocketOptionData) -> PRStatus::Type,
>;
pub type PRSetsocketoptionFN = Option<
    unsafe extern "C" fn(fd: *mut PRFileDesc, data: *const PRSocketOptionData) -> PRStatus::Type,
>;
pub type PRSendfileFN = Option<
    unsafe extern "C" fn(
        networkSocket: *mut PRFileDesc,
        sendData: *mut PRSendFileData,
        flags: PRTransmitFileFlags::Type,
        timeout: PRIntervalTime,
    ) -> PRInt32,
>;
pub type PRConnectcontinueFN =
    Option<unsafe extern "C" fn(fd: *mut PRFileDesc, out_flags: PRInt16) -> PRStatus::Type>;
pub type PRReservedFN = Option<unsafe extern "C" fn(fd: *mut PRFileDesc) -> PRIntn>;

#[repr(C)]
pub struct PRFileDesc {
    pub methods: *const PRIOMethods,
    pub secret: *mut PRFilePrivate,
    pub lower: *mut PRFileDesc,
    pub higher: *mut PRFileDesc,
    pub dtor: PRFileDescDtor,
    pub identity: PRDescIdentity,
}

#[repr(C)]
pub struct PRIOMethods {
    pub file_type: PRDescType::Type,
    pub close: PRCloseFN,
    pub read: PRReadFN,
    pub write: PRWriteFN,
    pub available: PRAvailableFN,
    pub available64: PRAvailable64FN,
    pub fsync: PRFsyncFN,
    pub seek: PRSeekFN,
    pub seek64: PRSeek64FN,
    pub fileInfo: PRFileInfoFN,
    pub fileInfo64: PRFileInfo64FN,
    pub writev: PRWritevFN,
    pub connect: PRConnectFN,
    pub accept: PRAcceptFN,
    pub bind: PRBindFN,
    pub listen: PRListenFN,
    pub shutdown: PRShutdownFN,
    pub recv: PRRecvFN,
    pub send: PRSendFN,
    pub recvfrom: PRRecvfromFN,
    pub sendto: PRSendtoFN,
    pub poll: PRPollFN,
    pub acceptread: PRAcceptreadFN,
    pub transmitfile: PRTransmitfileFN,
    pub getsockname: PRGetsocknameFN,
    pub getpeername: PRGetpeernameFN,
    pub reserved_fn_6: PRReservedFN,
    pub reserved_fn_5: PRReservedFN,
    pub getsocketoption: PRGetsocketoptionFN,
    pub setsocketoption: PRSetsocketoptionFN,
    pub sendfile: PRSendfileFN,
    pub connectcontinue: PRConnectcontinueFN,
    pub reserved_fn_3: PRReservedFN,
    pub reserved_fn_2: PRReservedFN,
    pub reserved_fn_1: PRReservedFN,
    pub reserved_fn_0: PRReservedFN,
}

unsafe extern "C" {
    pub fn PR_GetUniqueIdentity(layer_name: *const c_char) -> PRDescIdentity;
    pub fn PR_CreateIOLayerStub(
        ident: PRDescIdentity,
        methods: *const PRIOMethods,
    ) -> *mut PRFileDesc;
    pub fn PR_Close(fd: *mut PRFileDesc) -> PRStatus::Type;
}

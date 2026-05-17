/*******************************************************************************

    uBlock Origin - a comprehensive, efficient content blocker
    Copyright (C) 2017-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

// For background page, auxiliary pages, and content scripts.

/******************************************************************************/

const isUsableWebextAPI = candidate =>
    candidate instanceof Object &&
    (
        typeof Element === 'undefined' ||
        candidate instanceof Element === false
    );

const scoreWebextAPI = candidate => {
    if ( isUsableWebextAPI(candidate) === false ) {
        return -1;
    }
    let score = 0;
    const runtime = candidate.runtime;
    if ( runtime instanceof Object ) {
        if ( runtime.getManifest instanceof Function ) {
            score += 4;
        }
        if ( runtime.getURL instanceof Function ) {
            score += 4;
        }
        if ( runtime.connect instanceof Function ) {
            score += 2;
        }
    }
    if ( candidate.webRequest instanceof Object ) {
        score += 2;
    }
    if ( candidate.storage instanceof Object ) {
        score += 1;
    }
    if ( candidate.tabs instanceof Object ) {
        score += 1;
    }
    return score;
};

const resolveWebextAPI = ( ) => {
    const candidates = [];
    try {
        candidates.push(self.browser);
    } catch {
    }
    try {
        candidates.push(self.chrome);
    } catch {
    }

    let bestCandidate;
    let bestScore = -1;
    for ( const candidate of candidates ) {
        const score = scoreWebextAPI(candidate);
        if ( score > bestScore ) {
            bestScore = score;
            bestCandidate = candidate;
        }
    }
    return bestCandidate;
};

const webextAPI = resolveWebextAPI();

const resolveRuntimeAPI = ( ) => {
    const candidate = resolveWebextAPI();
    return candidate?.runtime instanceof Object
        ? candidate.runtime
        : undefined;
};

const resolveManifest = ( ) => {
    const runtimeAPI = resolveRuntimeAPI();
    if ( runtimeAPI?.getManifest instanceof Function ) {
        try {
            const manifest = runtimeAPI.getManifest();
            if ( manifest instanceof Object ) {
                return manifest;
            }
        } catch {
        }
    }
    return {
        name: 'uBlock Origin',
        version: '0.0.0',
    };
};

const resolveURL = (path = '') => {
    const runtimeAPI = resolveRuntimeAPI();
    if ( runtimeAPI?.getURL instanceof Function ) {
        try {
            return runtimeAPI.getURL(path);
        } catch {
        }
    }
    return path;
};

self.__afaqResolveWebextAPI = resolveWebextAPI;
self.__afaqResolveRuntimeAPI = resolveRuntimeAPI;
self.__afaqResolveManifest = resolveManifest;
self.__afaqResolveURL = resolveURL;

/******************************************************************************/

// https://bugzilla.mozilla.org/show_bug.cgi?id=1408996#c9
var vAPI = self.vAPI; // jshint ignore:line

// https://github.com/chrisaljoudi/uBlock/issues/464
// https://github.com/chrisaljoudi/uBlock/issues/1528
//   A XMLDocument can be a valid HTML document.

// https://github.com/gorhill/uBlock/issues/1124
//   Looks like `contentType` is on track to be standardized:
//   https://dom.spec.whatwg.org/#concept-document-content-type

// https://forums.lanik.us/viewtopic.php?f=64&t=31522
//   Skip text/plain documents.

if (
    (
        self.location?.protocol === 'moz-extension:' ||
        self.location?.protocol === 'chrome-extension:' ||
        (
            (
                document instanceof HTMLDocument ||
                document instanceof XMLDocument &&
                document.createElement('div') instanceof HTMLDivElement
            ) &&
            (
                /^image\/|^text\/plain/.test(document.contentType || '') === false
            )
        )
    ) &&
    (
        self.vAPI instanceof Object === false || vAPI.uBO !== true
    )
) {
    vAPI = self.vAPI = { uBO: true };
}








/*******************************************************************************

    DO NOT:
    - Remove the following code
    - Add code beyond the following code
    Reason:
    - https://github.com/gorhill/uBlock/pull/3721
    - uBO never uses the return value from injected content scripts

**/

void 0;

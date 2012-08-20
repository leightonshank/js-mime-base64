/* MIME_Base64.js - Class used to encode and decode strings into and from    */
/*             the base 64 encoding specified in RFC 2045 MIME (Multipurpose */
/*             Internet Mail Extensions).                                    */
/* Author: Leighton Shank                                         2/10/2006  */
/* Copyright: (c)2006 Leighton Shank, all rights reserved.                   */

/* usage:                                                                    */
/*     var encoded_string = Base64.encode(string);                           */
/*     var decoded_string = Base64.decode(encoded_string);                   */
/* notes:                                                                    */
/*     The Base64.encode function also takes an optional second parameter,   */
/*     specifying the end-of-line character to be used when breaking the     */
/*     encoded string into lines of 76 characters, per RFC specifications.   */
/*     By default, the newline '\n' character will be used.                  */

function Base64() {}
new Base64();
Base64.encode = encode_base64;
Base64.decode = decode_base64;

/* base64 alphabet */
var b64alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/* base64 encode function */
/* parameters: s (string to be encoded) eol (optional character to be used as */
/*             end-of-line character when breaking the encoded string into    */
/*             76-character lines as specified in the RFC.  Default is '\n'.  */
function encode_base64(s,eol) {
	var binVal, start, rs, encStr, ii;
    
	binVal = new String();
    // concat binary values into one string
    for (ii=0; ii < s.length; ii++) {
        binVal += _convert_binary(s.charCodeAt(ii),8);
    }

	start = 0;
	rs = "";
	while ( start + 24 <= binVal.length ) {
		rs += _encode_quantum(binVal.substring(start,start+24));
		start += 24;
	}

	if ( start < binVal.length ) {
		if ( binVal.length - start == 16 ) {
			// scenario (3) from RFC.  pad end with 2 zeroes, concat '='
			rs += _encode_quantum(binVal.substr(start,binVal.length)+"00");
			rs += '=';
		}
		else {
			// scenario (2) from RFC.  pad end with 4 zeroes, concat '=='
			rs += _encode_quantum(binVal.substr(start,binVal.length)+"0000");
			rs += '==';
		}
	}

	/* encoded string must be in lines of no longer than 76 characters */
    /* line breaks will be made with eol paramater, or default to \n */
	if ( !eol ) eol = '\n';
	start = 0;
	encStr = ""
	while ( start + 76 <= rs.length ) {
		encStr += rs.substring(start,start+76) + eol;
		start += 76;
	}
	encStr += rs.substring(start,rs.length) + eol;
	return encStr;
}

/* base64 decode function */
function decode_base64(s) {
	var binVal, start, decoded, ii;
	
	// verify that the input string is a multiple of 4
	if ( s.length % 4 != 0 ) return false;

	binVal = new String;
	for (ii=0; ii < s.length; ii++) {
		if ( s.charAt(ii) == '=' ) break;
		if ( b64alpha.indexOf(s.charAt(ii)) != -1 ) {
			binVal += _convert_binary(b64alpha.indexOf(s.charAt(ii)),6);
		}
	}
	// handle padding
	while ( s.charAt(s.length-1) == '=' ) {
		s = s.substring(0,s.length-1);
		binVal = binVal.substring(0,binVal.length-2);
	}

	start = 0;
	decoded = "";
	while ( start + 8 <= binVal.length ) {
		decoded += String.fromCharCode(_convert_binstr(binVal.substring(start,start+8)));
		start += 8;
	}
	
	return decoded;
}

/* function accepts a binary string and converts it to a 
   base 10 integer.  returns the converted value */
function _convert_binstr(b) {
	var rv, m, n, ii;
	rv = 0;
	m = 1;
	for (ii=b.length-1; ii >= 0; ii--) {
		n = parseInt(b.charAt(ii));
		rv += (n * m);
		m *= 2;
	}
	return rv;
}

/* function accepts an integer and returns an binary string of p bits */
function _convert_binary(n,p) {
	var bin = n.toString(2);
	// pad left side (high order) with 0's
	while ( bin.length < p ) { bin = '0'+bin; }
	return bin;
}

/* funciton will encode a base 64 quantum of multiple of 6 bits  */
function _encode_quantum(q) {
	var str, ss;
	str = "";
	for(ss = 0; ss < q.length; ss = ss + 6) {
		str += b64alpha.charAt(_convert_binstr(q.substring(ss,ss+6)));
	}
	return str;
}

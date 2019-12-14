export function encodeGroup(in_value) {
    let out_value = '';
    for (let idx=0; idx < in_value.length; idx++) {
        let val = in_value.charCodeAt(idx);
        out_value = out_value + String.fromCharCode(128 - val);
    }
    return out_value;
}

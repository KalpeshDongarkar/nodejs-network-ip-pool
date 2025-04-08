const prompt = require('prompt-sync')()

const IP_REGEX = /^((([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.|$)){3}([1-9]?\d|1\d\d|2[0-4]\d|25[0-5]))$/;
const SUBNET_REGEX = /^(8|9|1[0-9]|2[0-9]|3[0-2])$/;

var ipaddress = null;
var subnet = null;

function main() {
    if (ipaddress == null) {
        ipaddress = prompt('Please enter the IP value For eg: 192.168.0.1 : ');
    }

    if (IP_REGEX.test(ipaddress)) {
        if (subnet == null) {
            subnet = prompt('Please enter the subnet value between 8-32 : ');
        }

        if (SUBNET_REGEX.test(parseInt(subnet))) {
            GET_IPPOOL(ipaddress, parseInt(subnet))
        } else {
            subnet = null
            main();
        }
    } else {
        ipaddress = null;
        main();
    }

} main()



function GET_IPPOOL(ipaddress, subnet) {
    let ipJsn = { ip: ipaddress, subnet: subnet, noofip: (Math.pow(2, (32 - parseInt(subnet)))) - 2, networkip: null, subnetmaskip: null, useStartIP: null, useEndIP: null, broadcastip: null, rangeArr: [] }

    let ipSplitArr = [], ipSet = [], fnlStrtIPArr = [], sbntMskArr = [], brdcstIPArr = [], lstIPArr = [];
    let subStr = '', strtIpStr = '', fnlStrtIP = '', sbntMsk = '';

    ipSplitArr = ipaddress.split('.');

    Array(32).fill().forEach((_, i) => i < subnet ? subStr += '1' : subStr += '0')

    for (let i = 0; i < ipSplitArr.length; i++) {
        let bSet;
        let binryVal = '';
        let bin = 0;
        var rem, v = 1, step = 1;
        while (step <= 8) {
            rem = ipSplitArr[i] % 2;
            ipSplitArr[i] = (ipSplitArr[i] / 2);
            bin = bin + rem * v;
            v = v * 10
            step++;
            rem !== Math.floor(rem) ? binryVal += rem.toString().split('.')[0] : binryVal += rem.toString()
        }
        bSet = ((binryVal.split('')).reverse()).join('');
        ipSet.push(bSet);
    }
    let subArr = [] = subStr.match(/.{1,8}/g)
    for (let i = 0; i <= (subArr.length - 1); i++) {
        let aArr = [] = subArr[i].split('');
        let bArr = [] = ipSet[i].split('');

        for (let j = 0; j <= (aArr.length - 1); j++) {
            if (parseInt(aArr[j]) === parseInt(bArr[j]) && parseInt(aArr[j]) === 1 && parseInt(bArr[j]) === 1) {
                strtIpStr += '1'
            } else {
                strtIpStr += '0'
            }
            if (i == (subArr.length - 1)) {
                let start = []
                start = [] = strtIpStr.match(/.{1,8}/g);
                fnlStrtIP = parseInt(start[0], 2) + '.' + parseInt(start[1], 2) + '.' + parseInt(start[2], 2) + '.' + parseInt(start[3], 2);
                ipJsn.useStartIP = parseInt(start[0], 2) + '.' + parseInt(start[1], 2) + '.' + parseInt(start[2], 2) + '.' + (parseInt(start[3], 2) + ((ipJsn.noofip > 0) ? 1 : 0))
                sbntMsk = parseInt(subArr[0], 2) + '.' + parseInt(subArr[1], 2) + '.' + parseInt(subArr[2], 2) + '.' + parseInt(subArr[3], 2);
            }
        }
    }
    ipJsn.networkip = fnlStrtIP
    ipJsn.subnetmaskip = sbntMsk
    fnlStrtIPArr = fnlStrtIP.split('.')
    sbntMskArr = sbntMsk.split('.')

    for (let si = 0; si < fnlStrtIPArr.length; si++) {
        if (sbntMskArr[si] == 255) {
            brdcstIPArr.push(parseInt(fnlStrtIPArr[si]))
            lstIPArr.push(parseInt(fnlStrtIPArr[si]))
        } else if (sbntMskArr[si] != 255) {
            brdcstIPArr.push((((255 - parseInt(sbntMskArr[si])) + parseInt(fnlStrtIPArr[si]))))
            lstIPArr.push((((255 - parseInt(sbntMskArr[si])) + parseInt(fnlStrtIPArr[si])) - ((si == 3) ? 1 : 0)))
        }
    }
    ipJsn.useEndIP = lstIPArr.join('.');
    ipJsn.broadcastip = brdcstIPArr.join('.');
    console.log(ipJsn)
}





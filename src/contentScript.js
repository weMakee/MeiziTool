import CryptoJS from "crypto-js";
class ContentScript {
    constructor() {
        this.page = location.href.split('/').pop();
        
        this.host = 'kkmzt.com';
        this.key_salt = 'aeghiePh9ahx'
        this.init();
    }
    async init () {
        const menu = await this.wait_ele('body > section:nth-child(3) > div > div > main > div');
        const progressBar = await this.wait_ele('#progressBar');
        const clone_menu = menu.cloneNode(true);
        progressBar.parentNode.insertBefore(clone_menu, progressBar.nextSibling);
        const left = await this.wait_ele('div.uk-position-center-left')
        left.setAttribute('style', 'display:none;')
        const right = await this.wait_ele('div.uk-position-center-right')
        right.setAttribute('style', 'display:none;')
        const data = await this.parseData();
        const pic_url = (await this.wait_ele('figure img')).src;
        this.img_host = pic_url.substring(0, pic_url.lastIndexOf('/') + 1);
        this.showImage(data)
    }
    async parseData() {
        const { data } = await fetch(`https://${this.host}/app/post/p?id=${this.page}`).then(res => res.json());
        var t = this.page;
        var e = data;
        var n = "";
        var r = CryptoJS;
        var a = r;
        for (let i = 2; i < 18; i++) {
            n += (t % i % 10).toString();
        }
        var o = a.MD5(t + this.key_salt).toString();
        var c = a.MD5(n + o).toString().substring(8, 24);
        var s = e.split(o)[1];
        var u = a.enc.Hex.parse(s);
        var l = a.enc.Base64.stringify(u);
        c = a.enc.Utf8.parse(c);
        var d = a.AES.decrypt(l, c, {
            iv: a.enc.Utf8.parse(n),
            mode: a.mode.CBC,
            padding: a.pad.Pkcs7
        });
        return JSON.parse(d.toString(a.enc.Utf8));
    }
    async wait_ele (selector){
        return new Promise(resolve => {
            const checkExist = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkExist);
                    resolve(element);
                }
            }, 100);
        })
    }
    showImage (img_list) {
        img_list.slice(1).forEach(element => {
            const img = document.createElement('img');
            img.width = 1024;
            img.height = 1536;
            img.setAttribute('referrerpolicy','origin')
            img.src = this.img_host + element;
            document.querySelector('figure').appendChild(img);
        });
    }
}
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        new ContentScript();
    })
} else {
    new ContentScript();
}
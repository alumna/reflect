"use strict";var e=require("fs"),t=require("util");function i(e){var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var r=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,r.get?r:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var r=i(e);const s=t.promisify(r.copyFile),a=t.promisify(r.mkdir),c=t.promisify(r.readdir),h=t.promisify(r.rmdir),n=t.promisify(r.stat),o=t.promisify(r.unlink),d=t.promisify(r.utimes);class u{constructor(e,t,i,r,s){this.cache={},this.exclude={},this.recursive=e,this.delete=t,this.modified_within=null!==i&&Date.now()/1e3-i,this.only_newer=r,this.file_clone=s}async start(e,t,i){return e&&t?"string"!=typeof e||"string"!=typeof t?{res:!1,err:"Parameters 'src' and 'dest' must be string paths"}:(e=this.fix(e),t=this.fix(t),await this.prepare(e,"src")&&await this.prepare(t,"dest")?(i.forEach((t=>this.exclude[e+"/"+t]=!0)),await this.walk(e,t),{res:'Directory "'+e+'" reflected to "'+t+'"',err:!1}):{res:!1,err:"Parameters 'src' and 'dest' must be a directory"}):{res:!1,err:"Parameters 'src' and 'dest' must be defined"}}async prepare(e,t){return!!await this.is_dir(e)||!await this.read(e)&&("src"!=t&&(this.cache[e]=!0,await a(e),!0))}async walk(e,t){const i=[],r=await c(e),s=await c(t);if(this.delete&&s.length){const e={};r.forEach((t=>e[t]=!0));s.filter((i=>!e[i]&&!this.exclude[t+"/"+i])).forEach((e=>i.push(this.remove(t+"/"+e))))}return r.forEach((r=>i.push(this.sync(e+"/"+r,t+"/"+r)))),Promise.all(i)}async sync(e,t){return!!this.exclude[e]||(await this.is_dir(e)?!this.recursive||(await this.prepare(t,"dest"),this.walk(e,t)):!(!await this.read(t)||this.is_different(e,t))||(await s(e,t,this.file_clone?r.constants.COPYFILE_FICLONE:void 0),d(t,this.cache[e].atime,this.cache[e].mtime)))}async read(e){if(void 0===this.cache[e])try{return this.cache[e]=await n(e)}catch(t){return this.cache[e]=!1,!1}return this.cache[e]}async remove(e){if(!await this.is_dir(e))return this.cache[e]=!1,o(e);const t=await c(e);return await Promise.all(t.map((t=>this.remove(e+"/"+t)))),this.cache[e]=!1,h(e)}async is_dir(e){return!!await this.read(e)&&this.cache[e].isDirectory()}is_different(e,t){const i=this.cache[e].mtime.getTime()/1e3,r=this.cache[t].mtime.getTime()/1e3;return this.only_newer?i>r:!1!==this.modified_within?i>=this.modified_within&&i!==r:this.cache[e].size!=this.cache[t].size||i!==r}fix(e){const t=e.slice(-1);return"/"==t||"\\"==t?e.slice(0,-1):e}}module.exports=function({src:e,dest:t,recursive:i=!0,delete:r=!0,exclude:s=[],modified_within:a=null,only_newer:c=!1,file_clone:h=!0}){return new u(i,r,a,c,h).start(e,t,s)};

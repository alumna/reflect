import*as e from"fs";import{promisify as t}from"util";const i=t(e.copyFile),s=t(e.mkdir),r=t(e.readdir),a=t(e.rmdir),c=t(e.stat),h=t(e.unlink),n=t(e.utimes);class d{constructor(e,t,i,s,r){this.cache={},this.exclude={},this.recursive=e,this.delete=t,this.modified_within=null!==i&&Date.now()/1e3-i,this.only_newer=s,this.file_clone=r}async start(e,t,i){return e&&t?"string"!=typeof e||"string"!=typeof t?{res:!1,err:"Parameters 'src' and 'dest' must be string paths"}:(e=this.fix(e),t=this.fix(t),await this.prepare(e,"src")&&await this.prepare(t,"dest")?(i.forEach((t=>this.exclude[e+"/"+t]=!0)),await this.walk(e,t),{res:'Directory "'+e+'" reflected to "'+t+'"',err:!1}):{res:!1,err:"Parameters 'src' and 'dest' must be a directory"}):{res:!1,err:"Parameters 'src' and 'dest' must be defined"}}async prepare(e,t){return!!await this.is_dir(e)||!await this.read(e)&&("src"!=t&&(this.cache[e]=!0,await s(e),!0))}async walk(e,t){const i=[],s=await r(e),a=await r(t);if(this.delete&&a.length){const e={};s.forEach((t=>e[t]=!0));a.filter((i=>!e[i]&&!this.exclude[t+"/"+i])).forEach((e=>i.push(this.remove(t+"/"+e))))}return s.forEach((s=>i.push(this.sync(e+"/"+s,t+"/"+s)))),Promise.all(i)}async sync(t,s){return!!this.exclude[t]||(await this.is_dir(t)?!this.recursive||(await this.prepare(s,"dest"),this.walk(t,s)):!(!await this.read(s)||this.is_different(t,s))||(await i(t,s,this.file_clone?e.constants.COPYFILE_FICLONE:void 0),n(s,this.cache[t].atime,this.cache[t].mtime)))}async read(e){if(void 0===this.cache[e])try{return this.cache[e]=await c(e)}catch(t){return this.cache[e]=!1,!1}return this.cache[e]}async remove(e){if(!await this.is_dir(e))return this.cache[e]=!1,h(e);const t=await r(e);return await Promise.all(t.map((t=>this.remove(e+"/"+t)))),this.cache[e]=!1,a(e)}async is_dir(e){return!!await this.read(e)&&this.cache[e].isDirectory()}is_different(e,t){const i=this.cache[e].mtime.getTime()/1e3,s=this.cache[t].mtime.getTime()/1e3;return this.only_newer?i>s:!1!==this.modified_within?i>=this.modified_within&&i!==s:this.cache[e].size!=this.cache[t].size||i!==s}fix(e){const t=e.slice(-1);return"/"==t||"\\"==t?e.slice(0,-1):e}}function o({src:e,dest:t,recursive:i=!0,delete:s=!0,exclude:r=[],modified_within:a=null,only_newer:c=!1,file_clone:h=!0}){return new d(i,s,a,c,h).start(e,t,r)}export{o as default};

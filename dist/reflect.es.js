import{copyFile as t,mkdir as e,readdir as s,rmdir as r,stat as i,unlink as a,utimes as c}from"fs";import{promisify as h}from"util";const n=h(t),d=h(e),u=h(s),o=h(r),m=h(i),f=h(a),l=h(c);class w{constructor(t=!0,e=!0,s=[]){this.cache={},this.exclude={},this.recursive=t,this.delete=e,s.forEach(t=>this.exclude[t]=!0)}async start(t,e){return t&&e?"string"!=typeof t||"string"!=typeof e?{res:!1,err:"Parameters 'src' and 'dest' must be string paths"}:(t=this.fix(t),e=this.fix(e),await this.prepare(t,"src")&&await this.prepare(e,"dest")?(await this.walk(t,e),{res:'Directory "'+t+'" reflected to "'+e+'"',err:!1}):{res:!1,err:"Parameters 'src' and 'dest' must be a directory"}):{res:!1,err:"Parameters 'src' and 'dest' must be defined"}}async prepare(t,e){return!!await this.is_dir(t)||!await this.read(t)&&("src"!=e&&(this.cache[t]=!0,await d(t),!0))}async walk(t,e){const s=[],r=await u(t),i=await u(e);if(this.delete&&i.length){const t={};r.forEach(e=>t[e]=!0),i.filter(s=>!t[s]&&!this.exclude[e+"/"+s]).forEach(t=>s.push(this.remove(e+"/"+t)))}return r.forEach(r=>s.push(this.sync(t+"/"+r,e+"/"+r))),Promise.all(s)}async sync(t,e){return!!this.exclude[t]||(this.recursive&&await this.is_dir(t)?(await this.prepare(e,"dest"),this.walk(t,e)):!(!await this.read(e)||this.is_different(t,e))||(await n(t,e),l(e,this.cache[t].atime,this.cache[t].mtime)))}async read(t){if(void 0===this.cache[t])try{return this.cache[t]=await m(t)}catch(e){return this.cache[t]=!1,!1}return this.cache[t]}async remove(t){if(!await this.is_dir(t))return this.cache[t]=!1,f(t);const e=await u(t);return await Promise.all(e.map(e=>this.remove(t+"/"+e))),this.cache[t]=!1,o(t)}async is_dir(t){return!!await this.read(t)&&this.cache[t].isDirectory()}is_different(t,e){return this.cache[t].size!=this.cache[e].size||this.cache[t].mtime!=this.cache[e].mtime}fix(t){const e=t.slice(-1);return"/"==e||"\\"==e?t.slice(0,-1):t}}export default function({src:t,dest:e,recursive:s=!0,delete:r=!0,exclude:i=[]}){return new w(s,r,i).start(t,e)}

function $(){}function D(t,e){for(const n in e)t[n]=e[n];return t}function L(t){return t()}function k(){return Object.create(null)}function g(t){t.forEach(L)}function O(t){return typeof t=="function"}function ot(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function F(t){return Object.keys(t).length===0}function H(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function st(t,e,n){t.$$.on_destroy.push(H(e,n))}function at(t,e,n,i){if(t){const r=T(t,e,n,i);return t[0](r)}}function T(t,e,n,i){return t[1]&&i?D(n.ctx.slice(),t[1](i(e))):n.ctx}function ft(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const s=[],l=Math.max(e.dirty.length,r.length);for(let o=0;o<l;o+=1)s[o]=e.dirty[o]|r[o];return s}return e.dirty|r}return e.dirty}function dt(t,e,n,i,r,s){if(r){const l=T(e,n,i,s);t.p(l,r)}}function _t(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}const I=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;"WeakMap"in I;let w=!1;function G(){w=!0}function J(){w=!1}function K(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function Q(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const f=e[u];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,f=(r>0&&e[n[r]].claim_order<=u?r+1:K(1,r,b=>e[n[b]].claim_order,u))-1;i[c]=n[f]+1;const a=f+1;n[a]=c,r=Math.max(a,r)}const s=[],l=[];let o=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(s.push(e[c-1]);o>=c;o--)l.push(e[o]);o--}for(;o>=0;o--)l.push(e[o]);s.reverse(),l.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<l.length;c++){for(;u<s.length&&l[c].claim_order>=s[u].claim_order;)u++;const f=u<s.length?s[u]:null;t.insertBefore(l[c],f)}}function R(t,e){if(w){for(Q(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ht(t,e,n){w&&!n?R(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function U(t){t.parentNode&&t.parentNode.removeChild(t)}function mt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function V(t){return document.createElement(t)}function A(t){return document.createTextNode(t)}function pt(){return A(" ")}function yt(){return A("")}function gt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function bt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function X(t){return Array.from(t.childNodes)}function Y(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function q(t,e,n,i,r=!1){Y(t);const s=(()=>{for(let l=t.claim_info.last_index;l<t.length;l++){const o=t[l];if(e(o)){const c=n(o);return c===void 0?t.splice(l,1):t[l]=c,r||(t.claim_info.last_index=l),o}}for(let l=t.claim_info.last_index-1;l>=0;l--){const o=t[l];if(e(o)){const c=n(o);return c===void 0?t.splice(l,1):t[l]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=l,o}}return i()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function Z(t,e,n,i){return q(t,r=>r.nodeName===e,r=>{const s=[];for(let l=0;l<r.attributes.length;l++){const o=r.attributes[l];n[o.name]||s.push(o.name)}s.forEach(l=>r.removeAttribute(l))},()=>i(e))}function xt(t,e,n){return Z(t,e,n,V)}function tt(t,e){return q(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>A(e),!0)}function $t(t){return tt(t," ")}function wt(t,e){e=""+e,t.data!==e&&(t.data=e)}function vt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Et(t,e,n){t.classList[n?"add":"remove"](e)}function Nt(t,e){return new t(e)}let y;function p(t){y=t}function B(){if(!y)throw new Error("Function called outside component initialization");return y}function St(t){B().$$.on_mount.push(t)}function At(t){B().$$.after_update.push(t)}const h=[],C=[];let m=[];const E=[],P=Promise.resolve();let N=!1;function W(){N||(N=!0,P.then(z))}function Mt(){return W(),P}function S(t){m.push(t)}function jt(t){E.push(t)}const v=new Set;let _=0;function z(){if(_!==0)return;const t=y;do{try{for(;_<h.length;){const e=h[_];_++,p(e),et(e.$$)}}catch(e){throw h.length=0,_=0,e}for(p(null),h.length=0,_=0;C.length;)C.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];v.has(n)||(v.add(n),n())}m.length=0}while(h.length);for(;E.length;)E.pop()();N=!1,v.clear(),p(t)}function et(t){if(t.fragment!==null){t.update(),g(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}function nt(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const x=new Set;let d;function kt(){d={r:0,c:[],p:d}}function Ct(){d.r||g(d.c),d=d.p}function it(t,e){t&&t.i&&(x.delete(t),t.i(e))}function Lt(t,e,n,i){if(t&&t.o){if(x.has(t))return;x.add(t),d.c.push(()=>{x.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const rt=["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"];[...rt];function Ot(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Tt(t){t&&t.c()}function qt(t,e){t&&t.l(e)}function lt(t,e,n,i){const{fragment:r,after_update:s}=t.$$;r&&r.m(e,n),i||S(()=>{const l=t.$$.on_mount.map(L).filter(O);t.$$.on_destroy?t.$$.on_destroy.push(...l):g(l),t.$$.on_mount=[]}),s.forEach(S)}function ct(t,e){const n=t.$$;n.fragment!==null&&(nt(n.after_update),g(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ut(t,e){t.$$.dirty[0]===-1&&(h.push(t),W(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Bt(t,e,n,i,r,s,l,o=[-1]){const c=y;p(t);const u=t.$$={fragment:null,ctx:[],props:s,update:$,not_equal:r,bound:k(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:k(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};l&&l(u.root);let f=!1;if(u.ctx=n?n(t,e.props||{},(a,b,...M)=>{const j=M.length?M[0]:b;return u.ctx&&r(u.ctx[a],u.ctx[a]=j)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](j),f&&ut(t,a)),b}):[],u.update(),f=!0,g(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){G();const a=X(e.target);u.fragment&&u.fragment.l(a),a.forEach(U)}else u.fragment&&u.fragment.c();e.intro&&it(t.$$.fragment),lt(t,e.target,e.anchor,e.customElement),J(),z()}p(c)}class Pt{$destroy(){ct(this,1),this.$destroy=$}$on(e,n){if(!O(n))return $;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!F(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{lt as A,ct as B,at as C,dt as D,_t as E,ft as F,R as G,$ as H,st as I,Et as J,mt as K,gt as L,g as M,Ot as N,jt as O,Pt as S,pt as a,ht as b,$t as c,Lt as d,yt as e,Ct as f,it as g,U as h,Bt as i,At as j,V as k,xt as l,X as m,bt as n,St as o,vt as p,A as q,tt as r,ot as s,Mt as t,wt as u,kt as v,C as w,Nt as x,Tt as y,qt as z};

function n(t){return Promise.all(t.map(e=>e.text()))}async function o(t,e){e((await n(t))[0])}export{o as s};

// 360° dönüş: stüdyoda çekilmiş kare dizisinden ürün döndürme. Üç kip:
//   oto     — kendi kendine döner (kapak); sürüklenince durur, bırakınca kaldığı yerden sürer
//   surukle — sürükleyerek ve ok tuşlarıyla döner, bırakınca savrulur (ürün sayfası)
//   gezin   — fare kartın üstünde gezdikçe döner, çıkınca ilk kareye döner (dokunmatikte kapalı)
//   dis     — dışarıdan sürülür (yüzeyler dizisi yedi dönüşü birlikte çevirir)
// Kareler ilk etkileşimde ya da görünür olunca iner. İniş sırası ikiye bölmeli (0, 12, 6, 18, 3, ...):
// erken sürüklemede en yakın inmiş kare çizilir, dönüş baştan bütün turu kapsar.

type Kip = 'oto' | 'surukle' | 'gezin' | 'dis';

const azHareket = matchMedia('(prefers-reduced-motion: reduce)');
const fare = matchMedia('(hover: hover) and (pointer: fine)');
const yumusak = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function sira(n: number, bas = 0): number[] {
  const out: number[] = [];
  const gordu = new Set<number>();
  for (let adim = n; ; adim = Math.max(1, Math.floor(adim / 2))) {
    for (let i = 0; i < n; i += adim) {
      const k = (i + bas) % n;
      if (!gordu.has(k)) {
        gordu.add(k);
        out.push(k);
      }
    }
    if (adim === 1) break;
  }
  return out;
}

export class Donus {
  el: HTMLElement;
  img: HTMLImageElement | null;
  tuval: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  kare: number;
  kip: Kip;
  kok = '';
  kareler: (HTMLImageElement | undefined)[] = [];
  i = 0;
  cizilen = -1;
  istendi = false;
  aktif = false;
  gorunur = false;
  tutuyor = false;
  dokundu = false;
  hiz = 0;
  raf = 0;
  sonZaman = 0;
  otoBekle = 0;
  tw: { a: number; b: number; t0: number; ms: number } | null = null;
  x0 = 0;
  i0 = 0;
  izler: { x: number; t: number }[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    this.img = el.querySelector('img');
    this.tuval = document.createElement('canvas');
    this.tuval.setAttribute('aria-hidden', 'true');
    el.appendChild(this.tuval);
    this.ctx = this.tuval.getContext('2d')!;
    this.kare = Number(el.dataset.kare || 24);
    this.kip = (el.dataset.mod as Kip) || 'surukle';
    this.kok = this.kokSec();
    new ResizeObserver(() => this.boyutla()).observe(el);
    new IntersectionObserver(
      ([g]) => {
        this.gorunur = g.isIntersecting;
        if (g.isIntersecting) this.gorundu();
      },
      { rootMargin: '160px' },
    ).observe(el);
    this.olaylar();
  }

  kokSec(): string {
    const genis = this.el.clientWidth * Math.min(window.devicePixelRatio || 1, 2);
    const boy = this.el.dataset.boy || (genis > 620 ? 'b' : 'k');
    return `${this.el.dataset.kok}${boy}/`;
  }

  url(n: number) {
    return `${this.kok}${String(n).padStart(2, '0')}.webp`;
  }

  /** Kareleri indirir; bas: önce hangi kare (yüzey değişince o anki açı önce gelsin) */
  yukle(bas = 0) {
    if (this.istendi) return;
    this.istendi = true;
    const kok = this.kok;
    const yeni: (HTMLImageElement | undefined)[] = new Array(this.kare);
    const liste = sira(this.kare, bas);
    let k = 0;
    let ilk = true;
    const sonraki = () => {
      if (k >= liste.length || kok !== this.kok) return;
      const n = liste[k++];
      const im = new Image();
      im.decoding = 'async';
      im.src = this.url(n);
      im.decode()
        .then(() => {
          if (kok !== this.kok) return;
          yeni[n] = im;
          if (ilk) {
            ilk = false;
            this.kareler = yeni;
          }
          if (!this.aktif) this.etkinlestir();
          this.ciz(true);
          if (k >= liste.length && yeni.every(Boolean)) this.hazir();
        })
        .catch(() => {})
        .finally(sonraki);
    };
    for (let j = 0; j < 6; j++) sonraki();
  }

  hazir() {
    this.el.classList.add('hazir');
    // Ürün sayfasında bir kez tanıtım turu: döndürülebildiğini gösterir
    if (this.kip === 'surukle' && !this.dokundu && !azHareket.matches && this.gorunur) {
      this.tween(this.i + this.kare, 1900);
    }
  }

  etkinlestir() {
    this.aktif = true;
    this.boyutla();
    this.el.classList.add('calisiyor');
  }

  boyutla() {
    const r = this.el.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(r.width * d));
    const h = Math.max(1, Math.round(r.height * d));
    if (this.tuval.width !== w || this.tuval.height !== h) {
      this.tuval.width = w;
      this.tuval.height = h;
      this.ciz(true);
    }
  }

  enYakin(n: number) {
    if (this.kareler[n]) return n;
    for (let d = 1; d <= this.kare / 2; d++) {
      const a = (n + d) % this.kare;
      const b = (n - d + this.kare) % this.kare;
      if (this.kareler[a]) return a;
      if (this.kareler[b]) return b;
    }
    return -1;
  }

  get n() {
    return ((Math.round(this.i) % this.kare) + this.kare) % this.kare;
  }

  ciz(zorla = false) {
    if (!this.aktif) return;
    const n = this.n;
    const m = this.enYakin(n);
    if (m < 0 || (m === this.cizilen && !zorla)) return;
    const im = this.kareler[m]!;
    const { width: w, height: h } = this.tuval;
    const s = Math.min(w / im.naturalWidth, h / im.naturalHeight);
    const dw = im.naturalWidth * s;
    const dh = im.naturalHeight * s;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
    this.cizilen = m;
    if (this.kip === 'surukle') {
      this.el.setAttribute('aria-valuenow', String(n));
      this.el.setAttribute('aria-valuetext', `${Math.round((n * 360) / this.kare)}°`);
    }
    this.el.dispatchEvent(new CustomEvent('donus:kare', { detail: { n, kare: this.kare } }));
  }

  tween(hedef: number, ms: number) {
    this.hiz = 0;
    this.tw = { a: this.i, b: hedef, t0: performance.now(), ms };
    this.calistir();
  }

  dongu = (t: number) => {
    const dt = this.sonZaman ? Math.min(64, t - this.sonZaman) : 16;
    this.sonZaman = t;
    let devam = this.tutuyor;
    if (!this.tutuyor) {
      if (this.tw) {
        const p = Math.min(1, (t - this.tw.t0) / this.tw.ms);
        this.i = this.tw.a + (this.tw.b - this.tw.a) * yumusak(p);
        if (p >= 1) this.tw = null;
        devam = true;
      } else if (Math.abs(this.hiz) > 0.0005) {
        this.i += this.hiz * dt;
        this.hiz *= Math.pow(0.93, dt / 16);
        devam = true;
      } else if (this.kip === 'oto' && this.gorunur && !azHareket.matches) {
        if (t > this.otoBekle) this.i += dt * (this.kare / 5200);
        devam = true;
      }
    }
    this.ciz();
    if (devam) this.raf = requestAnimationFrame(this.dongu);
    else {
      this.raf = 0;
      this.sonZaman = 0;
    }
  };

  calistir() {
    if (!this.raf) {
      this.sonZaman = 0;
      this.raf = requestAnimationFrame(this.dongu);
    }
  }

  gorundu() {
    if (this.kip === 'oto') {
      this.yukle();
      this.calistir();
    } else if (this.kip === 'surukle') {
      this.yukle();
    }
  }

  /** Yüzey değişimi: yeni kare kökü; o anki açı korunur */
  kokDegistir(taban: string) {
    this.dokundu = true; // yüzey değişince tanıtım turu tekrarlanmasın
    this.el.dataset.kok = taban;
    const once = this.kok;
    this.kok = this.kokSec();
    if (this.kok === once) return;
    if (this.img) {
      this.img.srcset = `${taban}k/00.webp 500w, ${taban}b/00.webp 1000w`;
      this.img.src = `${taban}b/00.webp`;
    }
    const istendiMi = this.istendi;
    this.istendi = false;
    if (istendiMi || this.kip !== 'gezin') this.yukle(this.n);
    else {
      this.kareler = [];
      this.aktif = false;
      this.el.classList.remove('calisiyor');
    }
  }

  olaylar() {
    const el = this.el;
    el.addEventListener('dragstart', (e) => e.preventDefault());
    if (this.kip === 'dis') return;

    if (this.kip === 'gezin') {
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || !fare.matches) return;
        this.yukle();
      });
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !fare.matches || !this.aktif) return;
        const r = el.getBoundingClientRect();
        const oran = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        this.tw = null;
        this.i = (oran - 0.5) * (this.kare - 1);
        this.ciz();
      });
      el.addEventListener('pointerleave', () => {
        if (!this.aktif) return;
        this.tween(Math.round(this.i / this.kare) * this.kare, 520);
      });
      return;
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      this.dokundu = true;
      this.tutuyor = true;
      this.tw = null;
      this.hiz = 0;
      this.x0 = e.clientX;
      this.i0 = this.i;
      this.izler = [{ x: e.clientX, t: e.timeStamp }];
      el.setPointerCapture(e.pointerId);
      el.classList.add('tutuyor');
      this.yukle();
      this.calistir();
    });
    el.addEventListener('pointermove', (e) => {
      if (!this.tutuyor) return;
      const dx = e.clientX - this.x0;
      this.i = this.i0 + (dx / (el.clientWidth * 1.15)) * this.kare;
      this.izler.push({ x: e.clientX, t: e.timeStamp });
      if (this.izler.length > 6) this.izler.shift();
    });
    const birak = (e: PointerEvent) => {
      if (!this.tutuyor) return;
      this.tutuyor = false;
      el.classList.remove('tutuyor');
      const a = this.izler[0];
      const dt = e.timeStamp - a.t;
      if (dt > 0 && dt < 160) {
        const v = ((e.clientX - a.x) / (el.clientWidth * 1.15)) * this.kare / dt;
        this.hiz = Math.max(-0.05, Math.min(0.05, v));
      }
      if (this.kip === 'oto') this.otoBekle = performance.now() + 2600;
      this.calistir();
    };
    el.addEventListener('pointerup', birak);
    el.addEventListener('pointercancel', birak);

    if (this.kip === 'surukle') {
      el.addEventListener('keydown', (e) => {
        const yon = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (yon) {
          e.preventDefault();
          this.dokundu = true;
          this.yukle();
          this.tween(Math.round(this.i) + yon, 160);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.tween(Math.round(this.i / this.kare) * this.kare, 400);
        }
      });
    }
  }
}

export function donuslerKur(kok: ParentNode = document) {
  kok.querySelectorAll<HTMLElement>('[data-donus]').forEach((el) => {
    const e = el as HTMLElement & { _donus?: Donus };
    if (!e._donus) e._donus = new Donus(el);
  });
}

export const donusBul = (el: Element | null) => (el as (HTMLElement & { _donus?: Donus }) | null)?._donus;

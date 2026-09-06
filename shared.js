// ===== SECOND STORIES SHARED =====

const SSToast = {
  show(message, type = "info") {
    let host = document.getElementById("ssToastHost");

    if (!host) {
      host = document.createElement("div");
      host.id = "ssToastHost";
      host.className = "ss-toast-host";
      document.body.appendChild(host);
    }

    const toast = document.createElement("div");
    toast.className = `ss-toast ss-toast-${type}`;
    toast.textContent = message;
    host.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");

      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }
};


// ===== API HELPER =====

const API_BASE = "https://second-stories-production.up.railway.app";

async function apiJSON(url, options = {}) {
  const response = await fetch(API_BASE + url, {
    credentials: "include",
    ...options
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server mengembalikan respons bukan JSON (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Permintaan gagal.");
  }

  return data;
}


// ===== AUTH =====

const SSAuth = {
  currentUser: null,
  readyPromise: null,

  async getUser() {
    try {
      const data = await apiJSON("/api/me");
      this.currentUser = data.user;
      return data.user;
    } catch {
      this.currentUser = null;
      return null;
    }
  },

  ready() {
    if (!this.readyPromise) {
      this.readyPromise = this.getUser();
    }

    return this.readyPromise;
  },

  async login(email, password) {
    const data = await apiJSON("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    this.currentUser = data.user;
    return data.user;
  },

  async register(name, email, password) {
    const data = await apiJSON("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    this.currentUser = data.user;
    return data.user;
  },

  async logout() {
    await apiJSON("/api/logout", {
      method: "POST"
    });

    this.currentUser = null;

    SSWishlist.reset();
    SSCart.reset();
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  openModal() {
    const overlay = document.getElementById("ssAuthModalOverlay");

    if (overlay) {
      overlay.hidden = false;
      overlay._setMode?.("login");
    }
  },

  refreshHeaders() {
    document
      .querySelectorAll("[data-auth-name]")
      .forEach(el => {
        el.textContent = this.currentUser
          ? this.currentUser.name
          : "";
      });

    document
      .querySelectorAll("[data-login-btn], .login-btn")
      .forEach(el => {
        el.textContent = this.currentUser
          ? "Logout"
          : "Login";
      });
  },

  mountAuthUI() {
    if (document.getElementById("ssAuthModalOverlay")) {
      return;
    }

    const wrap = document.createElement("div");

    wrap.innerHTML = `
      <div
        class="ss-modal-overlay"
        id="ssAuthModalOverlay"
        hidden
      >
        <div class="ss-modal-card ss-auth-card">

          <button
            class="ss-modal-close"
            id="ssAuthCloseBtn"
            aria-label="Tutup"
          >
            ✕
          </button>

          <div class="ss-auth-tabs">
            <button
              type="button"
              class="ss-auth-tab active"
              data-mode="login"
            >
              Masuk
            </button>

            <button
              type="button"
              class="ss-auth-tab"
              data-mode="register"
            >
              Daftar
            </button>
          </div>

          <h3
            class="ss-auth-title"
            id="ssAuthTitle"
          >
            Selamat Datang Kembali <span>♡</span>
          </h3>

          <form id="ssAuthForm">

            <label
              class="field-label"
              id="ssAuthNameLabel"
              for="ssAuthName"
              hidden
            >
            Nama Lengkap
            </label>

            <input
              type="text"
              id="ssAuthName"
              class="field-input"
              placeholder="Nama lengkap"
              hidden
            >

            <label
              class="field-label"
              for="ssAuthEmail"
            >
              Email
            </label>

            <input
              type="email"
              id="ssAuthEmail"
              class="field-input"
              placeholder="nama@email.com"
              required
            >

            <label
              class="field-label"
              for="ssAuthPass"
            >
              Kata Sandi
            </label>

            <input
              type="password"
              id="ssAuthPass"
              class="field-input"
              placeholder="••••••••"
              minlength="4"
              required
            >

            <button
              type="submit"
              class="btn btn-primary ss-auth-submit"
              id="ssAuthSubmitBtn"
            >
              Masuk
            </button>

          </form>

          <p class="ss-auth-note">
            Akunmu disimpan di database Second Stories.
          </p>

        </div>
      </div>
    `;

    document.body.appendChild(wrap.firstElementChild);

    const overlay =
      document.getElementById("ssAuthModalOverlay");

    const form =
      document.getElementById("ssAuthForm");

    const tabs =
      overlay.querySelectorAll(".ss-auth-tab");

    const title =
      document.getElementById("ssAuthTitle");

    const nameLabel =
      document.getElementById("ssAuthNameLabel");

    const nameInput =
      document.getElementById("ssAuthName");

    const email =
      document.getElementById("ssAuthEmail");

    const pass =
      document.getElementById("ssAuthPass");

    const submit =
      document.getElementById("ssAuthSubmitBtn");

    let mode = "login";


    // ===== LOGIN / REGISTER MODE =====

    const setMode = modeName => {
      mode = modeName;

      tabs.forEach(tab => {
        tab.classList.toggle(
          "active",
          tab.dataset.mode === modeName
        );
      });

      const isRegister =
        modeName === "register";

      nameLabel.hidden = !isRegister;
nameInput.hidden = !isRegister;

nameLabel.style.display = isRegister ? "" : "none";
nameInput.style.display = isRegister ? "" : "none";

nameInput.required = isRegister;
      title.innerHTML = isRegister
        ? "Buat Akun Baru <span>✧</span>"
        : "Selamat Datang Kembali <span>♡</span>";

      submit.textContent = isRegister
        ? "Daftar Sekarang"
        : "Masuk";
    };


    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        setMode(tab.dataset.mode);
      });
    });


    // ===== CLOSE MODAL =====

    const close = () => {
      overlay.hidden = true;
    };

    document
      .getElementById("ssAuthCloseBtn")
      .addEventListener("click", close);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        close();
      }
    });


    // ===== LOGIN / REGISTER SUBMIT =====

    form.addEventListener("submit", async event => {
      event.preventDefault();

      submit.disabled = true;

      try {
        const user =
          mode === "register"
            ? await SSAuth.register(
                nameInput.value.trim(),
                email.value.trim(),
                pass.value
              )
            : await SSAuth.login(
                email.value.trim(),
                pass.value
              );

        close();
        form.reset();

        SSToast.show(
          mode === "register"
            ? `Halo, ${user.name}! Akun berhasil dibuat.`
            : `Selamat datang kembali, ${user.name}!`,
          "success"
        );

        SSAuth.refreshHeaders();

        await SSWishlist.ready();
        await SSCart.refresh();

        document.dispatchEvent(
          new CustomEvent("ss-auth-success", {
            detail: { user }
          })
        );

      } catch (err) {
        SSToast.show(err.message, "error");

      } finally {
        submit.disabled = false;
      }
    });


    overlay._setMode = setMode;

    this.ready().then(() => {
      this.refreshHeaders();
    });
  }
};


// ===== WISHLIST =====

const SSWishlist = {
  ids: [],
  readyPromise: null,

  reset() {
    this.ids = [];
    this.readyPromise = null;
    this.updateBadge();
  },

  async ready() {
    if (!this.readyPromise) {
      this.readyPromise = (async () => {

        if (!SSAuth.isLoggedIn()) {
          this.ids = [];
          return this.ids;
        }

        try {
          const data =
            await apiJSON("/api/wishlist");

          this.ids = data.ids || [];

        } catch {
          this.ids = [];
        }

        this.updateBadge();

        return this.ids;
      })();
    }

    return this.readyPromise;
  },

  get() {
    return [...this.ids];
  },

  has(id) {
    return this.ids.includes(Number(id));
  },

  async toggle(id) {
    await SSAuth.ready();

    if (!SSAuth.isLoggedIn()) {
      SSAuth.openModal();

      throw new Error(
        "Login terlebih dahulu untuk menggunakan wishlist."
      );
    }

    id = Number(id);

    const added = !this.has(id);

    await apiJSON(`/api/wishlist/${id}`, {
      method: added ? "POST" : "DELETE"
    });

    if (added) {
      this.ids.push(id);
    } else {
      this.ids =
        this.ids.filter(x => x !== id);
    }

    this.updateBadge();

    return added;
  },

  async remove(id) {
    await SSAuth.ready();

    if (!SSAuth.isLoggedIn()) {
      return;
    }

    await apiJSON(
      `/api/wishlist/${Number(id)}`,
      {
        method: "DELETE"
      }
    );

    this.ids =
      this.ids.filter(
        x => x !== Number(id)
      );

    this.updateBadge();
  },

  count() {
    return this.ids.length;
  },

  updateBadge() {
    document
      .querySelectorAll(".wishlist-badge-shared")
      .forEach(badge => {
        badge.textContent = this.count();

        badge.style.display =
          this.count()
            ? "flex"
            : "none";
      });

    document
      .querySelectorAll(".wishlist-nav-icon")
      .forEach(icon => {
        icon.classList.toggle(
          "active",
          this.count() > 0
        );

        icon.title =
          this.count()
            ? `${this.count()} barang di wishlist`
            : "Wishlist";
      });
  }
};


// ===== CART =====

const SSCart = {
  items: [],
  readyPromise: null,

  reset() {
    this.items = [];
    this.readyPromise = null;
    this.updateBadge();
  },

  async refresh() {
    if (!SSAuth.isLoggedIn()) {
      this.items = [];
      this.updateBadge();
      return this.items;
    }

    try {
      const data =
        await apiJSON("/api/cart");

      this.items = data.cart || [];

    } catch (error) {
      this.items = [];
    }

    this.updateBadge();

    return this.items;
  },

  async ready() {
    if (!this.readyPromise) {
      this.readyPromise = this.refresh();
    }

    return this.readyPromise;
  },

  get() {
    return [...this.items];
  },

  async add(product, qty = 1) {
    await SSAuth.ready();

    if (!SSAuth.isLoggedIn()) {
      SSAuth.openModal();

      throw new Error(
        "Login terlebih dahulu untuk menambahkan barang ke keranjang."
      );
    }

    await apiJSON("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: qty
      })
    });

    await this.refresh();

    return this.items;
  },

  async remove(id) {
    await apiJSON(
      `/api/cart/${Number(id)}`,
      {
        method: "DELETE"
      }
    );

    await this.refresh();

    return this.items;
  },

  async setQty(id, qty) {
    await apiJSON(
      `/api/cart/${Number(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quantity: Math.max(
            1,
            Number(qty)
          )
        })
      }
    );

    await this.refresh();

    return this.items;
  },

  async clear() {
    if (SSAuth.isLoggedIn()) {
      await apiJSON("/api/cart", {
        method: "DELETE"
      });
    }

    this.items = [];
    this.updateBadge();
  },

  totalQty() {
    return this.items.reduce(
      (sum, item) =>
        sum + Number(item.qty),
      0
    );
  },

  subtotal() {
    return this.items.reduce(
      (sum, item) =>
        sum +
        Number(item.qty) *
        Number(item.price),
      0
    );
  },

  updateBadge() {
    const count = this.totalQty();

    document
      .querySelectorAll(
        "#cartBadge, .cart-badge-shared"
      )
      .forEach(badge => {
        badge.textContent = count;

        badge.style.display =
          count
            ? "flex"
            : "none";
      });
  }
};


// ===== ORDERS & LISTINGS =====

const SSOrders = {
  async getAll() {
    try {
      await SSAuth.ready();

      if (!SSAuth.isLoggedIn()) {
        return [];
      }

      const data =
        await apiJSON("/api/orders");

      return data.orders || [];

    } catch {
      return [];
    }
  }
};


const SSListings = {
  async getAll() {
    try {
      await SSAuth.ready();

      if (!SSAuth.isLoggedIn()) {
        return [];
      }

      const data =
        await apiJSON("/api/my-products");

      return data.products || [];

    } catch {
      return [];
    }
  }
};


// ===== AUTH UI INITIALIZATION =====

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    SSAuth.mountAuthUI();

    document
      .querySelectorAll(".login-btn")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async () => {

            if (SSAuth.isLoggedIn()) {

              await SSAuth.logout();

              SSAuth.refreshHeaders();

              SSToast.show(
                "Kamu sudah logout.",
                "success"
              );

              document.dispatchEvent(
                new CustomEvent(
                  "ss-auth-logout"
                )
              );

            } else {
              SSAuth.openModal();
            }
          }
        );
      });

    await SSAuth.ready();
    await SSWishlist.ready();
    await SSCart.ready();

    SSAuth.refreshHeaders();
  }
);


// ===== COMMON E-COMMERCE UI SAFETY =====

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const info = {
      contact: [
        "Contact",
        "Untuk saat ini hubungi penjual melalui fitur Chat pada halaman produk."
      ],

      faq: [
        "FAQ",
        "FAQ demo: pilih produk, tambahkan ke keranjang, lalu checkout. Data akun, keranjang, wishlist, dan pesanan tersimpan di database."
      ],

      pengiriman: [
        "Pengiriman",
        "Reguler Rp15.000 (estimasi 2–4 hari) dan Express Rp30.000 (estimasi 1 hari)."
      ],

      pembayaran: [
        "Pembayaran",
        "Tersedia pilihan Transfer Bank, E-Wallet, dan COD pada checkout."
      ],

      tnc: [
        "Syarat & Ketentuan",
        "Barang preloved dijual sesuai kondisi yang dijelaskan penjual. Pastikan data checkout benar sebelum membayar."
      ]
    };


    document
      .querySelectorAll("a[data-info]")
      .forEach(link => {

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();

            const data =
              info[link.dataset.info];

            if (data) {
              SSToast.show(
                data[0] + ": " + data[1],
                "info"
              );
            }
          }
        );
      });


    document
      .querySelectorAll(
        '.socials a[href="#"]'
      )
      .forEach(link => {

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();

            SSToast.show(
              "Link media sosial belum tersedia pada versi demo.",
              "info"
            );
          }
        );
      });
  }
);


// ===== TNC & NEWSLETTER =====

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const tnc =
      document.getElementById(
        "tncPeekLink"
      );

    if (tnc) {
      tnc.addEventListener(
        "click",
        event => {

          event.preventDefault();

          SSToast.show(
            "Syarat & Ketentuan: jelaskan kondisi barang dengan jujur, pastikan data produk benar, dan pembeli memeriksa detail sebelum checkout.",
            "info"
          );
        }
      );
    }


    document
      .querySelectorAll(
        "form[id$='NewsletterForm'], .newsletter-form"
      )
      .forEach(form => {

        if (form.dataset.sharedBound) {
          return;
        }

        form.dataset.sharedBound = "1";

        form.addEventListener(
          "submit",
          event => {

            event.preventDefault();

            const input =
              form.querySelector(
                'input[type="email"]'
              );

            if (input?.value.trim()) {

              SSToast.show(
                "Terima kasih! Email kamu berhasil dicatat untuk update promo.",
                "success"
              );

              form.reset();
            }
          }
        );
      });
  }
);

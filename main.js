const app = Vue.createApp({
  data() {
    return {
      product: "Socks",
      description: "Nice warm socks you can wear all year round",
      image: "./assets/vmSocks-green-onWhite.jpg",
      url: "https://google.com",
      inventory: 20,
      onSale: false,
      details: ["50% cotton", "30% wool", "20% polyester"],
      variants: [
        {
          id: 2234,
          color: "green ",
          image: "./assets/vmSocks-green-onWhite.jpg",
        },
        { id: 2235, color: "blue", image: "./assets/vmSocks-blue-onWhite.jpg" },
      ],
      sizes: ["small", "medium", "large"],
      cart: 0,
    };
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    updateImage(variantImage) {
      this.image = variantImage;
    },
  },
});

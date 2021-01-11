var eventBus = new Vue();

// PRODUCT COMPONENT
Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },

  // TEMPLATE LITERAL
  template: `
    <div class="product">
      <div class="product-image">
        <a :href="image_link"><img :src="image" :alt="description" /></a>
      </div>

      <!-- Product Title and Stock -->

      <div class="product-info">

        

        <h1>{{ title }}</h1>

        <p v-if="inStock"> In Stock </p>
        <p v-else :class="{outOfStock: !inStock }"> Out of Stock </p>  

        <!-- Color Choice Boxes -->

        <div v-for="(variant, index) in variants" 
          :key="variant.variantId" class="color-box cursorHover"
          :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">

        </div>

        <!-- BUTTON + LISTENER -->

        <button @click="removeFromCart" style="background-color: red;"> Remove </button>
        <button @click="addToCart" :disabled="!inStock" :cflass="{disabledButton: !inStock }"> Add to Cart </button>
      
        <product-tabs :reviews="reviews" :details="details" :premium="premium"></product-tabs>    

      </div>
    </div>
    `,
  // ADD DATA AS AN OBJECT(FUNCTION)
  data() {
    // MUST RETURN SOMETHING TO THE COMPONENT TO RENDER
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "Green Socks",
      selectedVariant: 0,
      image_link:
        "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
      inventory: 90,
      details: ["80% cotton", "20% polyester", "Gender-Neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0,
        },
      ],
      reviews: [],
      sizes: [
        {
          sizesId: 2235,
          size: "small",
        },
        {
          sizesId: 2236,
          size: "medium",
        },
        {
          sizesId: 2237,
          size: "large",
        },
      ],

      
    };
  },
  // KEEP METHODS AND COMPUTATIONS SEPARATE!
  methods: {
    // increase cart by one
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
      console.log(this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    // hover over color updates color of product
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },

    shipping() {
      if (this.premium) {
        return " FREE";
      }
      return "$2.99";
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

// PRODUCT REVIEW
Vue.component("product-review", {
  template: `
  
  <form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length"> 
  <b> Please correct the following error(s): </b>
  <ul>
    <li v-for="error in errors" style="color:red;"> {{ error }} </li>
  </ul>
</p>

  <p class="centeredText">Leave a review</p>
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name"  >
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea id="review" v-model="review"  ></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>
<br>





  <p> Would you recommend this product? </p>

  <input type="radio" style="all:revert;" value="Yes" v-model="recommend"> Yes </input>
  <br>
  <input type="radio" style="all:revert;" value="No" v-model="recommend"> No </input>
      
  <p>
    <input type="submit" value="Submit">  
  </p>    

</form>

  `,

  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      // console.log(this.recommend)

      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };

        console.log(productReview);

        // RESETS FORM BACK TO BLANK AFTER SUBMIT
        eventBus.$emit("review-submitted", productReview);
        (this.name = null),
          (this.review = null),
          (this.rating = null),
          (this.recommend = null);
      } else {
        if (!this.name) this.errors.push("Name is required.");
        if (!this.review) this.errors.push("Review is required.");
        if (!this.rating) this.errors.push("Rating is required.");
        if (!this.recommend)
          this.errors.push("Please select a Recommendation.");
      }
    },
  },
});

//PRODUCT TABS COMPONENT
Vue.component("product-tabs", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div class="tabsMargins"> 

    <span class="tab"
      :class="{ activeTab: selectedTab === tab}"
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectedTab = tab">
        {{ tab }}         
    </span>

    <div v-show="selectedTab === 'Reviews'">
    <h2> Reviews </h2>
    <p v-if="!reviews.length"> There are no reviews yet. </p>
      <ul v-else>
        <li v-for="(review, index) in reviews" :key="index"> 
        <p> User: {{ review.name }}</p>
        <p>Rating: {{ review.rating }} Stars </p>
        <p>{{ review.review }}</p>
        <p> Recommended: {{ review.recommend }}</p>
        </li>
      </ul>
    </div>

    <ul v-show="selectedTab === 'Product Details'">
    <li v-for="detail in details"> {{ detail }} </li>
    </ul>

    <div v-show="selectedTab === 'Shipping'" :premium="premium"> 
      <h4 class="shippingStyle"> Shipping:  {{ shipping }} </h4>
    </div>   

    <product-review v-show="selectedTab === 'Make a Review'"> </product-review> 

    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review", "Shipping", "Product Details"],
      selectedTab: "Reviews",
    };
  },
  computed: {
    shipping() {
      if (this.premium) {
        return " Free";
      }
      return "$2.99";
    },
  },
});

// APP INSTANCE
var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    updateRemoveCart(id) {
      if (this.cart != 0) {
        this.cart.pop(id);
      }
    },
  },
});
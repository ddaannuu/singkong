<template>
  <Navbar />
  <HeroSection />
  <FeaturesSection />
  <HowItWorks />
  <Testimoni />
  <Action />
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import Testimoni from '../components/Testimoni.vue'
import Action from '../components/Action.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Navbar,
    HeroSection,
    FeaturesSection,
    HowItWorks,
    Testimoni,
    Action,
    Footer
  }
}
</script>
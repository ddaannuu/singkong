<template>
  <Navbar />
  <HeroSection />
  <About />
  <Stat />
  <FeaturesSection />
  <HowItWorks />
  <Testimoni />
  <Action />
  <Footer />
</template>

<script>
import Navbar from '../components/landing-page/Navbar.vue'
import HeroSection from '../components/landing-page/HeroSection.vue'
import About from '../components/landing-page/About.vue'
import Stat from '../components/landing-page/Stat.vue'
import FeaturesSection from '../components/landing-page/FeaturesSection.vue'
import HowItWorks from '../components/landing-page/HowItWorks.vue'
import Testimoni from '../components/landing-page/Testimoni.vue'
import Action from '../components/landing-page/Action.vue'
import Footer from '../components/landing-page/Footer.vue'

export default {
  components: {
    Navbar,
    HeroSection,
    About,
    Stat,
    FeaturesSection,
    HowItWorks,
    Testimoni,
    Action,
    Footer,
  },
}
</script>

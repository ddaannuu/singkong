<template>
  <Navbar />
  <HeroSection />
  <About/>
  <Stat />
  <FeaturesSection />
  <HowItWorks />
  <Testimoni />
  <Action />
  <Footer />
</template>

<script>
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import About from '../components/About.vue'
import Stat from '../components/Stat.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import Testimoni from '../components/Testimoni.vue'
import Action from '../components/Action.vue'
import Footer from '../components/Footer.vue'


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
    Footer
  }
}
</script>
<script setup lang="ts">
import NavBar from '../components/layout/NavBar.vue'
import Footer from '../components/layout/Footer.vue'
import Hero from '../components/sections/Hero.vue'
import About from '../components/sections/About.vue'
import TechStack from '../components/sections/TechStack.vue'
import Projects from '../components/sections/Projects.vue'
import SocialLinks from '../components/sections/SocialLinks.vue'
import ToolsSection from '../components/sections/ToolsSection.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <NavBar />
    </header>

    <main class="flex-1 pt-14">
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <SocialLinks />
      <ToolsSection />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

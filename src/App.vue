<template>
  <div class="app-shell">
    <header class="hero">
      <div class="hero-copy">
        <span class="tag">Shaolin Coach</span>
        <h1>Treine kung fu com foco em disciplina, força e mobilidade.</h1>
        <p>
          Uma aplicação para organizar sua rotina de treino, técnicas e progressão diária.
        </p>
      </div>
    </header>

    <main>
      <div class="page-nav">
        <RouterLink to="/">Registrar treino</RouterLink>
        <RouterLink to="/recommend">Recomendar</RouterLink>
        <RouterLink to="/config">Configuração</RouterLink>
      </div>

      <router-view />
    </main>

    <footer class="footer">
      <p>Desenvolvido para auxiliar o treino de kung fu Shaolin Norte.</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

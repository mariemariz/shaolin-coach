<template>
  <div class="app-shell">
    <header class="hero">
      <div class="hero-copy">
        <span class="tag">Shaolin Coach</span>
        <h1>Assistente de treinos de Kung Fu Shaolin do Norte.</h1>
        <p>
          Uma aplicação para organizar sua rotina de treino, técnicas e progressão diária.
        </p>
      </div>
    </header>

    <main>
      <div class="page-nav">
        <RouterLink to="/">Registrar treino</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
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

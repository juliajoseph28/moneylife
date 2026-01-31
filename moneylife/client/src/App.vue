<template>
  <div style="background: #1a1a2e; min-height: 100vh; padding: 20px;">
    <h1 style="color: white;">🎮 MoneyLife Test</h1>
    <p style="color: #94a3b8;">If you see this, Vue is working!</p>
    
    <div style="margin-top: 20px;">
      <router-link to="/" style="color: #4ade80; margin-right: 20px;">Home</router-link>
      <router-link to="/game" style="color: #4ade80;">Game</router-link>
    </div>
    
    <router-view />
  </div>
</template>
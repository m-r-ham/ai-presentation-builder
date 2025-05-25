---
theme: default
title: AI Presentation Builder - Layout Templates
info: |
  ## Consulting Layout Templates
  Professional slide layouts based on SDF design patterns
class: text-center
transition: slide-left
mdc: true
---

# AI Presentation Builder
## Layout Template System

Professional consulting slide layouts powered by Slidev

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next slide <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: two-cols
layoutClass: gap-16
---

# Split Layout: Left Text, Right Visual

Key design pattern for data presentation with context

- Perfect for explaining charts and graphs
- Maintains visual balance
- Logical reading flow (left to right)
- Ideal for 2-4 bullet points

::right::

<div class="h-full flex items-center justify-center bg-blue-50 rounded-lg">
  <div class="text-center">
    <div class="text-4xl mb-4">📊</div>
    <div class="text-sm text-gray-600">Chart/Visual Area</div>
    <div class="text-xs mt-2">Revenue Growth: +23%</div>
  </div>
</div>

<!--
SDF Pattern: split-left-text-right-visual
Use Cases: Data presentation with context, Feature explanations, Before/after comparisons
Effectiveness Score: 0.85
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Split Layout: Right Text, Left Visual

Image-first storytelling approach

- Visual emphasis takes priority
- Great for product showcases
- Contextual text support
- Clean hierarchy

**Best for:**
- Product demonstrations
- Visual case studies
- Emotional storytelling

<!--
SDF Pattern: split-right-text-left-visual  
Use Cases: Image-first storytelling, Visual emphasis, Product showcases
Effectiveness Score: 0.82
-->

---
layout: center
class: text-center
---

# Center Focus: Minimal Layout

<div class="grid grid-cols-3 gap-8 mt-8">
  <div class="p-6 bg-blue-50 rounded-lg">
    <div class="text-3xl mb-4">🎯</div>
    <div class="font-semibold">Single Focus</div>
    <div class="text-sm text-gray-600 mt-2">One key message</div>
  </div>
  <div class="p-6 bg-green-50 rounded-lg">
    <div class="text-3xl mb-4">✨</div>
    <div class="font-semibold">Clean Design</div>
    <div class="text-sm text-gray-600 mt-2">Minimal distractions</div>
  </div>
  <div class="p-6 bg-purple-50 rounded-lg">
    <div class="text-3xl mb-4">🎪</div>
    <div class="font-semibold">High Impact</div>
    <div class="text-sm text-gray-600 mt-2">Maximum attention</div>
  </div>
</div>

<!--
SDF Pattern: center-focus-minimal
Use Cases: Key insights, Impactful statements, Section dividers
Effectiveness Score: 0.94
-->

---
layout: default
---

# Chart with Text Overlay

<div class="relative h-80 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6">
  <!-- Simulated Chart Area -->
  <div class="absolute inset-6 bg-white rounded shadow-sm border">
    <div class="h-full flex items-end justify-around p-4">
      <div class="bg-blue-500 w-12" style="height: 60%"></div>
      <div class="bg-blue-600 w-12" style="height: 80%"></div>
      <div class="bg-blue-700 w-12" style="height: 45%"></div>
      <div class="bg-blue-800 w-12" style="height: 90%"></div>
    </div>
  </div>
  
  <!-- Overlay Text Box -->
  <div class="absolute top-8 right-8 bg-white p-4 rounded-lg shadow-lg max-w-48">
    <div class="font-bold text-sm mb-2">Key Insight</div>
    <div class="text-xs text-gray-600">Q4 shows 23% growth with strong momentum in core segments</div>
  </div>
</div>

**Perfect for:** Dense data visualization, Key insights highlight, Space-efficient design

<!--
SDF Pattern: chart-with-overlay-text
Use Cases: Dense data visualization, Key insights highlight, Space-efficient design  
Effectiveness Score: 0.88
-->

---
layout: default
---

# Vertical Stack Layout

## Context Section
Brief introduction or executive summary providing necessary background for the data below.

<div class="h-48 bg-gray-50 rounded-lg mt-6 p-6 flex items-center justify-center">
  <div class="text-center">
    <div class="text-2xl mb-4">📈 Timeline Chart</div>
    <div class="text-sm text-gray-600">Full-width visualization showing process flow or timeline data</div>
    <div class="mt-4 flex justify-center space-x-8">
      <div class="text-xs">Q1</div>
      <div class="text-xs">Q2</div>
      <div class="text-xs">Q3</div>
      <div class="text-xs">Q4</div>
    </div>
  </div>
</div>

<!--
SDF Pattern: vertical-text-chart-stack
Use Cases: Complex charts needing context, Timeline presentations, Process flows
Effectiveness Score: 0.81
-->

---
layout: default
class: grid grid-cols-2 gap-6
---

# Grid Layout: Equal Distribution

<div class="space-y-4">
  <div class="bg-blue-50 p-4 rounded-lg">
    <div class="font-semibold text-blue-800">Strategy</div>
    <div class="text-sm text-blue-600 mt-2">Market positioning and competitive analysis</div>
  </div>
  <div class="bg-green-50 p-4 rounded-lg">
    <div class="font-semibold text-green-800">Operations</div>
    <div class="text-sm text-green-600 mt-2">Process optimization and efficiency gains</div>
  </div>
</div>

<div class="space-y-4">
  <div class="bg-purple-50 p-4 rounded-lg">
    <div class="font-semibold text-purple-800">Technology</div>
    <div class="text-sm text-purple-600 mt-2">Digital transformation and automation</div>
  </div>
  <div class="bg-orange-50 p-4 rounded-lg">
    <div class="font-semibold text-orange-800">People</div>
    <div class="text-sm text-orange-600 mt-2">Talent development and change management</div>
  </div>
</div>

<!--
SDF Pattern: grid-layout-equal
Use Cases: Multiple topics, Service offerings, Comparative analysis
Effectiveness Score: 0.79
-->

---
layout: quote
author: Design System Principle
---

"Every slide should have a single, clear purpose and guide the viewer's attention to the most important information first."

---
layout: end
---

# Template System Ready

These layouts form the foundation for AI-generated presentations

**Next Steps:**
- Custom Vue components for charts/diagrams  
- Professional consulting theme
- AI integration with layout selection
- Export to PDF/PPTX for client delivery

<div class="text-center mt-8">
  <div class="text-sm text-gray-500">Built with Slidev + SDF Framework</div>
</div>
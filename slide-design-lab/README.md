# 🧪 Slide Design Lab

**Crowd-sourced training platform for AI slide generation**

A focused environment for collecting high-quality slide design feedback to improve AI presentation generation. Users create slide prompts, rate 3 generated versions, and provide detailed feedback on design quality.

## 🎯 Purpose

This lab collects training data to improve the main [AI Presentation Builder](../). Every rating and feedback helps the AI learn better design patterns and create more effective presentations.

## 🚀 Public Deployment

**Live Lab:** [https://slide-design-lab.vercel.app](https://slide-design-lab.vercel.app)

Anyone can contribute to improving AI slide design! No signup required.

## 🏗 How It Works

1. **Prompt**: Describe a slide you want created
2. **Generate**: AI creates 3 different versions  
3. **Rate**: Score each version on 6 design dimensions
4. **Decide**: Keep, Kill, or Revise the slide approach
5. **Improve**: Data feeds back to improve the AI

## 📊 Design Dimensions

We rate slides on these 6 qualities:

- **Visual Hierarchy** - Clear order and priority
- **Information Density** - Right amount of content  
- **Readability** - Easy to read and understand
- **Visual Appeal** - Aesthetically pleasing
- **Layout Balance** - Good composition and spacing
- **Content Clarity** - Clear message delivery

## 🔄 Integration

Training data automatically exports to the main AI Presentation Builder via:
```
GET /api/analytics/export-for-main-app
```

This replaces mock training data with real user-validated design patterns.

## 🛠 Local Development

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Backend: http://localhost:3003
# Frontend: http://localhost:5174
```

## 📈 Analytics

Track training progress and export insights:

- `/api/training/stats` - Overall statistics
- `/api/analytics/patterns` - Design pattern analysis  
- `/api/analytics/insights` - Success factor analysis

## 🌍 Contributing

Help improve AI slide design by using the live lab! More diverse feedback = better AI for everyone.

## 🔗 Related

- [Main AI Presentation Builder](../)
- [Slidev Documentation](https://sli.dev/)
- [Design System Framework](../backend/src/services/slideDesignFramework.js)

---

**Built to make AI presentations better for everyone** 🎯
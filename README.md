# Design OS - Nuxt Edition

This project is a port of the original [Design OS](https://github.com/buildermethods/design-os), rebuilt from the ground up using [Nuxt 3](https://nuxt.com/) and the [@nuxt/ui](https://ui.nuxt.com/) component library.

## About the Original Design OS

> Design OS is an open-source tool for product development teams to define, design, and deliver products systematically. It bridges the gap between a product idea and its codebase by guiding users through a structured process of defining a product vision, structuring data models, designing the UI, and exporting production-ready components.

This structured approach helps create a clear specification and a shared understanding before implementation begins, which is invaluable when working with modern development tools.

All credit for the concept, workflow, and original implementation goes to the team at **buildermethods**.

## The Nuxt Port: Key Changes & Enhancements

This version reimagines the original application within the Nuxt 3 ecosystem, introducing several key changes and leveraging Nuxt's powerful features.

- **Framework:** The original Vite-based React application has been migrated to the **Nuxt 3** framework, providing a robust, production-ready foundation.
- **UI Components:** We've replaced the original UI components with **[@nuxt/ui](https://ui.nuxt.com/)**. This provides a sleek, modern, and highly customizable set of components that are deeply integrated with Nuxt, supporting features like themeability and dark mode out-of-the-box.
- **File-based Routing:** The project now leverages Nuxt's file-based routing system, simplifying page management and creating a more intuitive project structure.
- **Data Management with Composables:** Data fetching and state logic have been refactored into Nuxt `composables` (e.g., `useProductData`, `useSectionData`) for better organization, reusability, and type safety across the application.

## Core Features (Inherited from Design OS)

- **Product Vision:** Define the core purpose and goals of your product.
- **Data Model:** Structure the data and entities that your application will use.
- **Sections & Screens:** Design individual sections and screens, mapping out the user experience.
- **Component-Based Design:** Build out the UI using a systematic approach.
- **Export:** Generate a production-ready package from your designs.

## Getting Started

Follow these steps to get the application running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/installation)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/nuxt-design-os.git
    cd nuxt-design-os
    ```

2.  Install dependencies using pnpm:
    ```bash
    pnpm install
    ```

### Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Build

Build the application for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## License

This project is licensed under the MIT License, consistent with the original Design OS project.
# React Logic Separation: Architecture Patterns for Modern React Applications

This repository explores different architectural approaches to structuring React applications with a focus on **separating business logic from UI components**. Each implementation tackles the same contacts management application but uses different patterns and libraries to achieve clean, maintainable, and testable code.

## Overview

Modern React applications often suffer from business logic scattered across components, making them difficult to test, maintain, and evolve. This project demonstrates various patterns to extract and isolate business logic from UI components, resulting in a cleaner architecture.

The core idea is to create a clear **separation of concerns** where:
- UI components handle presentation and user interactions
- Business logic lives in dedicated services, commands, or models
- Data fetching and state management are abstracted away from components

## Application Examples

The repository contains multiple implementations of the same contacts management application, each showcasing different architectural approaches:

### 1. `contacts-app-signals-clean-architecture`

Combines Clean Architecture with reactive state management using Preact Signals:

- **Domain Layer**: Contains pure business logic, entities, and repository interfaces
- **Application Layer**: Commands and services that implement use cases  
- **Infrastructure Layer**: API implementations, React Query integrations
- **UI Layer**: React components consuming view models

Key feature: Domain code depends only on abstractions (repository interfaces), while concrete implementations are injected at runtime.

- Preserves the layered architecture of Clean Architecture
- Uses Signals to create reactive state that can be consumed across components
- Implements a collection pattern inspired by tanstack-db to manage caching
- Provides a rich example of dependency inversion with Signal-based repositories

Check the [app readme file for more details](/apps/contacts-app-signals-clean-architecture/Readme.md)

### 3. `contacts-app-signals`

A simpler implementation using Preact Signals for state management:

- Uses signals for global state management
- Implements commands for business logic
- Demonstrates how to create view models with signals
- Shows a pragmatic approach without strict adherence to Clean Architecture

### 4. `contacts-app-react-query`

Shows how to build a React application with React Query for data fetching:

- Focuses on using React Query's capabilities for server state management
- Implements simple commands for business logic
- Provides a more standard React approach with hooks and context

### 5. `contacts-app-react-query-db`

Combines React Query with a database-like abstraction:

- Leverages TanStack Query/DB for robust data management
- Implements collections for managing related entities
- Shows how to build view models that use the query-db pattern
- Demonstrates a hybrid approach between traditional React patterns and more advanced architecture

## Shared Core Library

The `contacts-app-core` library contains shared code used across all implementations:

- Common interfaces and types
- Repository abstractions
- Command definitions
- Shared UI components
- Common services

This allows each implementation to focus on its unique architectural approach while reusing common elements.

## Key Concepts

Throughout these implementations, you'll find several architectural patterns:

1. **Command Pattern**: Encapsulating business logic in command objects with a single responsibility
2. **Repository Pattern**: Abstracting data access behind interfaces
3. **View Models**: Mediating between UI and business logic
4. **Dependency Inversion**: High-level modules depending on abstractions
5. **Reactive State Management**: Using signals or other reactive primitives
6. **Collections**: Managing sets of related entities

## Getting Started

To run any of the example applications:

```bash
# Install dependencies
npm install

# Run a specific app
nx serve contacts-app-signals-clean-architecture
```

## Conclusion

This repository demonstrates that React applications benefit significantly from architectural patterns that separate business logic from UI components. By exploring different approaches, developers can choose patterns that best fit their project's complexity and requirements.

Whether you prefer classic Clean Architecture, reactive programming with signals, or a more pragmatic approach with React Query, the key is establishing clear boundaries between your application layers.

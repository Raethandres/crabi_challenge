# **Sistema de Prevención de Lavado de Dinero (PLD) - API**

Este proyecto implementa un servicio en Node.js que interactúa con un sistema externo de prevención de lavado de dinero (PLD) para la validación de nuevos usuarios en nuestra plataforma. El objetivo es prevenir actividades ilícitas como fraudes y cumplir con las regulaciones legales.

## **Tabla de Contenidos**
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Endpoints](#endpoints)
    - [Crear un usuario](#crear-un-usuario)
    - [Login](#login)
    - [Obtener un usuario](#obtener-un-usuario)
- [Colección de Postman](#colección-de-postman)
- [Dockerización](#dockerización)
- [Recursos](#recursos)

---

## **Requisitos**

Para ejecutar este proyecto necesitas tener instalados:
- **Node.js** v14+
- **Docker** y **Docker Compose**
- **Postman** (para probar los endpoints con la colección incluida)

---

## **Instalación**

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/pld-service.git
   cd pld-service

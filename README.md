# Nazmul Hasan Nokib – Personal Portfolio

A premium, highly-animated personal portfolio and blog built with **React**, **Vite**, **GSAP**, and **MDX**. 
This project features a fully internal blog system, integrated email subscriptions, and state-of-the-art animations.

---

## 🚀 Tech Stack

- **Core:** React 19 + Vite
- **Styling:** Tailwind CSS (Custom Design System)
- **Animations:** GSAP (ScrollTrigger, useGSAP) + Framer Motion
- **Blog Content:** MDX (with Frontmatter support)
- **Routing:** React Router Dom
- **Communication:** EmailJS (Subscribe system), SweetAlert2
- **Icons:** Material Icons & React Icons

---

## ✍️ Internal Blog Workflow (MDX)

I have migrated the blog from Hashnode to a fully internal MDX-based system for maximum performance and SEO.

### How to add a new post:

1.  **Create MDX file:** Add a new `.mdx` file in `src/content/blog/`.
    - Use the following frontmatter structure:
      ```md
      ---
      title: "Your Post Title"
      date: "2026-02-26"
      description: "A short snippet for the blog card."
      tags: ["Development", "React"]
      readTime: 5
      coverImage: null
      ---
      ```
2.  **Register the post:** Open `src/lib/posts.js` and add your post metadata to the `posts` array.
    - Ensure the `slug` matches your filename exactly.
3.  **Content:** Write your post using standard Markdown or embed React components directly in the MDX.

### Features:
- **Bangla Support:** Native support for Bengali typography with custom line-heights and spacing.
- **Reading Progress:** Real-time progress bar at the top of the post.
- **Social Share:** Integrated sharing for X (Twitter), LinkedIn, and direct link copying.
- **Premium Prose:** Custom `article-body` styling for optimal readability.

---

## 📧 Subscription System (EmailJS)

The portfolio includes a "Stay in the loop" subscription form at the bottom of every blog post.

### Setup:
1.  Sign up at [EmailJS](https://emailjs.com/).
2.  Create an Email Service and an Email Template.
3.  In your template, use `{{subscriber_email}}` to capture the reader's input.
4.  Update your credentials in `src/components/Blog/Subscribe.jsx`:
    ```js
    const EMAILJS_SERVICE_ID = 'your_service_id';
    const EMAILJS_TEMPLATE_ID = 'your_template_id';
    const EMAILJS_PUBLIC_KEY = 'your_public_key';
    ```

---

## 📂 Project Structure

```text
src/
├── api/             # API services
├── components/      # UI Components (GSAP/Framer)
│   ├── Blog/        # Blog-specific components
│   └── Common/      # Reusable helpers (Magnetic, etc.)
├── content/
│   └── blog/        # MDX Blog Posts (.mdx)
├── data/            # Static site data (Projects, Skills)
├── lib/             # Utility logic & Post Registry
├── App.jsx          # Routing & Layout
└── index.css        # Design System & article-body styles
```

---

## ⚙️ Installation

1.  **Clone:** `git clone https://github.com/nokib-web/Portfolio.git`
2.  **Install:** `npm install`
3.  **Dev:** `npm run dev`
4.  **Build:** `npm run build`

---

## 📞 Contact

- **Email:** [nokibnokib1@gmail.com](mailto:nokibnokib1@gmail.com)
- **WhatsApp:** [+8801910229119](https://wa.me/8801910229119)
- **LinkedIn:** [Nazmul Hasan Nokib](https://linkedin.com/in/nokib-web)

---

📜 **License:** MIT. Feel free to use this for your own portfolio!

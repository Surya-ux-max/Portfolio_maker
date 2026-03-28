# 🎯 Quick Start Guide - FirstPortfolio

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd server
npm run dev
```
Expected output: `Server running on port 5000` and `MongoDB Connected`

### 2. Start Frontend Development Server
```bash
cd client
npm run dev
```
Expected output: Server running at `http://localhost:5173`

### 3. Access the Application
- **Landing Page**: http://localhost:5173
- **Register**: http://localhost:5173/register
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard (after login)
- **Editor**: http://localhost:5173/editor (after login)
- **Public Portfolio**: http://localhost:5173/u/[username]

---

## 📋 Quick Test Flow

### Step 1: Create Account
1. Go to http://localhost:5173/register
2. Fill in:
   - Name: John Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: Password123
3. Click "Create Account"
4. You'll be redirected to Dashboard

### Step 2: Create Portfolio
1. Click "Create Portfolio" button on Dashboard
2. Fill in each tab:

**Personal Tab**:
- Full Name: John Doe
- Role: Full Stack Developer
- Bio: Passionate developer with experience in MERN stack...
- Email: john@example.com
- Location: New York, NY

**Experience Tab**:
- Click "Add"
- Position: Software Engineer
- Company: Tech Corp
- Location: Remote
- Start: Jan 2023
- End: Present
- Description: Building scalable web applications...

**Education Tab**:
- Click "Add"
- Institution: MIT
- Degree: Bachelor's
- Field: Computer Science
- Start: 2019
- End: 2023

**Skills Tab**:
- Click "Add" multiple times
- Examples: React (Advanced), Node.js (Advanced), MongoDB (Intermediate)

**Projects Tab**:
- Click "Add"
- Title: E-commerce Platform
- Description: Full-stack e-commerce application...
- Tech Stack: React, Node.js, MongoDB, Stripe
- GitHub: https://github.com/johndoe/ecommerce
- Live Link: https://ecommerce-demo.com

**Social Tab**:
- GitHub: https://github.com/johndoe
- LinkedIn: https://linkedin.com/in/johndoe
- Twitter: https://twitter.com/johndoe

**Settings Tab**:
- Theme: Light or Dark
- Public Portfolio: Toggle ON
- Template: Modern

3. Click "Save" after filling information
4. Wait for "Saved" confirmation

### Step 3: View Dashboard
1. Click back arrow to return to Dashboard
2. See your portfolio status
3. Click "Copy" to copy your portfolio URL
4. Click "View" to see your public portfolio

### Step 4: View Public Portfolio
1. Open http://localhost:5173/u/johndoe
2. Verify all information displays correctly
3. Check responsiveness by resizing browser

---

## ✅ Feature Checklist

Use this checklist to verify all features work:

### Authentication ✓
- [ ] Register new user
- [ ] Login existing user
- [ ] Logout
- [ ] Protected routes work
- [ ] Token persists on refresh

### Dashboard ✓
- [ ] Displays user name
- [ ] Shows portfolio status
- [ ] Copy URL works
- [ ] View portfolio works
- [ ] Checklist shows completion
- [ ] Navigate to editor

### Editor - Personal ✓
- [ ] All fields editable
- [ ] Data saves correctly
- [ ] Live preview updates

### Editor - Experience ✓
- [ ] Add new experience
- [ ] Edit experience
- [ ] Delete experience
- [ ] Data saves

### Editor - Education ✓
- [ ] Add new education
- [ ] Edit education
- [ ] Delete education
- [ ] Data saves

### Editor - Skills ✓
- [ ] Add new skill
- [ ] Select skill level
- [ ] Delete skill
- [ ] Data saves

### Editor - Projects ✓
- [ ] Add new project
- [ ] Tech stack parsing works
- [ ] Delete project
- [ ] Data saves

### Editor - Social ✓
- [ ] All social links editable
- [ ] Data saves

### Editor - Settings ✓
- [ ] Theme toggle works
- [ ] Privacy toggle works
- [ ] Template selection works
- [ ] Data saves

### Public Portfolio ✓
- [ ] Displays personal info
- [ ] Shows experience timeline
- [ ] Shows education timeline
- [ ] Displays skills grid
- [ ] Shows projects
- [ ] Social links work
- [ ] Responsive design
- [ ] Returns 404 for private

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Make sure MongoDB is running
# For local: mongod
# For Atlas: Check connection string in .env
```

### Port Already in Use
```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

### CORS Error
- Check that Vite proxy is configured in `vite.config.js`
- Verify backend has `cors()` middleware
- Restart both servers

### 404 on API Calls
- Verify backend is running on port 5000
- Check network tab in browser DevTools
- Ensure `/api` routes are correct

### Data Not Saving
- Check browser console for errors
- Verify JWT token in localStorage
- Check MongoDB connection
- Verify user is logged in

---

## 🎨 Customization Tips

### Change Primary Color
Edit `index.css` and replace indigo colors:
- `indigo-600` → your color
- Update scrollbar color
- Update button colors

### Add More Templates
1. Create new template in Settings dropdown
2. Update PublicPortfolio component with template logic
3. Add template preview images

### Add More Skill Levels
Edit Editor.jsx Skills tab:
```jsx
<option value="Novice">Novice</option>
<option value="Beginner">Beginner</option>
<option value="Intermediate">Intermediate</option>
<option value="Advanced">Advanced</option>
<option value="Expert">Expert</option>
<option value="Master">Master</option>
```

---

## 📱 Testing Different Devices

### Desktop (1920x1080)
- Full split-screen editor
- All features visible
- Live preview works

### Tablet (768x1024)
- Responsive editor
- Single column layout
- Touch-friendly

### Mobile (375x667)
- Mobile-optimized
- Stack layout
- Easy navigation

---

## 🎯 Performance Tips

### Frontend
- Use React.memo for heavy components
- Implement debouncing for auto-save
- Lazy load images

### Backend
- Add index on username field
- Implement caching for public portfolios
- Use compression middleware

---

## 🔐 Security Notes

### Current Implementation
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected API routes
- ✅ Input validation (client-side)

### For Production
- Add rate limiting
- Implement HTTPS
- Add CSRF protection
- Server-side validation
- SQL injection prevention (using Mongoose)
- XSS protection

---

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  isPremium: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolios Collection
```javascript
{
  userId: ObjectId (ref: User),
  templateId: String,
  personalInfo: {...},
  education: [{...}],
  skills: [{...}],
  projects: [{...}],
  experience: [{...}],
  socialLinks: {...},
  settings: {...},
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **JWT**: https://jwt.io

---

**Happy Portfolio Building!** 🚀

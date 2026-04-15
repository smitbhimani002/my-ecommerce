# Wishlist Feature - Testing & Setup Guide

## 🎯 Quick Start

### 1. Verify Backend Files Created

```
✓ backend/src/models/wishlist.model.js
✓ backend/src/controllers/wishlist.controller.js
✓ backend/src/routes/wishlist.route.js
✓ backend/src/app.js (updated with wishlist router)
```

### 2. Test Backend Routes (Use Postman)

**Note**: All requests must include authentication cookie (get by login first)

#### A. Add to Wishlist

```
POST http://localhost:3000/api/wishlist/add
Body (JSON):
{
  "productId": "YOUR_PRODUCT_ID_HERE"
}

Expected Response:
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": { ... }
}
```

#### B. Get Wishlist

```
GET http://localhost:3000/api/wishlist

Expected Response:
{
  "success": true,
  "wishlist": {
    "products": [
      {
        "_id": "...",
        "name": "Product Name",
        "price": 999,
        "image": "...",
        "category": "..."
      }
    ]
  }
}
```

#### C. Remove from Wishlist

```
POST http://localhost:3000/api/wishlist/remove
Body (JSON):
{
  "productId": "YOUR_PRODUCT_ID_HERE"
}

Expected Response:
{
  "success": true,
  "message": "Product removed from wishlist",
  "wishlist": { ... }
}
```

#### D. Check if Product in Wishlist

```
GET http://localhost:3000/api/wishlist/check/YOUR_PRODUCT_ID_HERE

Expected Response:
{
  "success": true,
  "isInWishlist": true/false
}
```

### 3. Test Frontend Features

#### A. Heart Icon on Product Cards

1. Go to any product page (Men Wear, Women Wear, etc.)
2. Hover over product card
3. Click heart icon in top-right corner
4. Should fill with red color
5. Toast: "Added to Wishlist ❤️"

#### B. Wishlist Section in Cart

1. Go to Shopping Cart page
2. Add any item to cart
3. Click heart icon on cart item
4. "Saved for Later" section appears below coupons
5. Saved item shows with price and category
6. Can remove from there

#### C. Visit Wishlist Page

```javascript
// Add to your routing (if using React Router)
import Wishlist from "./pages/Wishlist.jsx";

// Add route
<Route path="/wishlist" element={<Wishlist />} />;
```

1. Navigate to `/wishlist`
2. View all saved products in grid layout
3. Click "Add to Cart" to move to shopping cart
4. Click trash icon to remove from wishlist
5. Empty state shows if no items

### 4. Integration with Navbar

Add Wishlist link to your Navbar component:

```jsx
import { Heart } from "lucide-react";
import { Link } from "react-router-dom"; // if using React Router
import { useCart } from "./context/CartContext";

// In Navbar component:
const { wishlist } = useCart();

<Link to="/wishlist" className="flex items-center gap-1">
  <Heart className="w-5 h-5" />
  <span>Wishlist ({wishlist.length})</span>
</Link>;
```

## 🧪 Testing Scenarios

### Scenario 1: Add Multiple Products to Wishlist

- [ ] Login with test account
- [ ] Navigate to multiple product pages
- [ ] Click heart icon on different products
- [ ] Verify toast appears each time
- [ ] Go to Wishlist page
- [ ] All products should appear

### Scenario 2: Prevent Duplicates

- [ ] Add product to wishlist
- [ ] Click heart again (should remove, not duplicate)
- [ ] Wishlist page should still show only one copy

### Scenario 3: Add to Cart from Wishlist

- [ ] Go to Wishlist page
- [ ] Click "Add to Cart" on a product
- [ ] Should appear in shopping cart
- [ ] Item should still be in wishlist (optional: you can auto-remove)

### Scenario 4: Remove from Wishlist

- [ ] From Wishlist page, click trash icon
- [ ] Toast: "Removed from Wishlist"
- [ ] Product disappears from list
- [ ] Heart icon on product cards should now be outline

### Scenario 5: Empty Wishlist Message

- [ ] Clear all items from wishlist
- [ ] Navigate to Wishlist page
- [ ] Should show empty state with message

### Scenario 6: Login/Logout

- [ ] Login
- [ ] Add products to wishlist
- [ ] Logout
- [ ] Login again
- [ ] Wishlist should be restored

### Scenario 7: Cross-Device Sync

- [ ] Add to wishlist on desktop
- [ ] Check on mobile (same account)
- [ ] Should be synchronized

## 🐛 Troubleshooting

### Issue: Heart icon not updating

**Solution**:

- Check if `toggleWishlist` is imported from context
- Verify `isProductInWishlist` is being called with correct productId
- Check browser console for errors

### Issue: Toast notifications not showing

**Solution**:

- Ensure `react-toastify` is installed
- Check if ToastContainer is in App.jsx
- Verify toast imports in components

### Issue: Wishlist not persisting after refresh

**Solution**:

- This is by design (stored in DB)
- Check network tab to verify API calls succeed
- Verify user is logged in (check cookies)
- Check browser console for 401/403 errors

### Issue: "Product not found" error

**Solution**:

- Verify the productId is correct and exists in database
- Check MongoDB Atlas if using remote DB
- Ensure product was created properly

### Issue: API returning 401 Unauthorized

**Solution**:

- User must be logged in first
- Check if login sets accessToken cookie
- Verify verifyJWT middleware is installed
- Clear cookies and login again

## ✅ Verification Checklist

- [ ] Backend files created and no syntax errors
- [ ] Routes mounted in app.js
- [ ] Can add product to wishlist (API works)
- [ ] Can retrieve wishlist (GET request works)
- [ ] Can remove from wishlist (DELETE works)
- [ ] Heart icon appears on product cards
- [ ] Heart icon fills when product is saved
- [ ] Wishlist section appears in Cart page
- [ ] Wishlist page displays saved products
- [ ] Toast notifications show correctly
- [ ] Can add to cart from wishlist
- [ ] Duplicates are prevented in database
- [ ] Only logged-in users can access wishlist
- [ ] Loading states work properly

## 📱 Responsive Testing

Test on different screen sizes:

- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Extra large (1440px+)

## 🎉 All Done!

Your wishlist feature is ready to use. Users can now:

- ❤️ Save products for later
- 📍 View all saved items in dedicated page
- 🛒 Add saved items to cart
- 🔄 Remove items from wishlist
- 📊 See wishlist count in navbar

Enjoy!

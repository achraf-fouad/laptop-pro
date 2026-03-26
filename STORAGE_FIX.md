# 🖼️ FIX: How to restore broken product images

The images are not appearing because the symbolic link from your public folder (`public_html`) to the backend storage folder is missing on the server.

### 🚀 Step-by-Step Fix:

1.  **Locate the fix script**: Look for the file `fix_storage.php` I created in your project root.
2.  **Upload the file**: Upload this `fix_storage.php` directly into your server's **`public_html`** folder using cPanel File Manager.
3.  **Run the script**: Visit your site in your browser:  
    `https://maroclaptop.com/fix_storage.php`
4.  **Confirm**: If it says "SUCCESS", your images should start working immediately!
5.  **Clean up**: After it works, delete `fix_storage.php` from your server for security.

### ⚠️ Common Issue:
If the script says "A FOLDER named 'storage' exists", you must:
1.  Go to cPanel File Manager.
2.  Open `public_html`.
3.  Delete the existing `storage` folder (as it is likely empty and blocking the link).
4.  Refresh the `fix_storage.php` page in your browser.

---

# 📱 Responsive Improvements:

I have also updated your React frontend to:
1.  **Improve Categories on Mobile**: Changed from 1 row per category to a 2-column grid. This makes the homepage much shorter and easier to browse.
2.  **Bigger Buttons**: Increased the font size of "Add to Cart" and "Quick Buy" buttons so they are easier to tap and read on mobile devices.

To see these changes live, you need to:
1.  Build your project: `npm run build`
2.  Upload the content of the `dist/` folder to your `public_html` on cPanel.

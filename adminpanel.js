// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getFirestore, collection, addDoc, doc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBGBimDkH4udFoX-xJ9knySaJdT400tYrc",
    authDomain: "acornturf-70ddd.firebaseapp.com",
    projectId: "acornturf-70ddd",
    storageBucket: "acornturf-70ddd.firebasestorage.app",
    messagingSenderId: "114396648312",
    appId: "1:114396648312:web:f5ecd875c54eae5f256e8d",
    measurementId: "G-RK524LV3RJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  window.addEventListener('DOMContentLoaded', () => {
    // Hero Section
    
    let heroImageFile = null;
    const heroUploadBtn = document.getElementById('heroupload');
    if (heroUploadBtn) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      heroUploadBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          heroImageFile = file;
          updateHeroUploadUI(file.name);
        }
      });
    }

    const heroUploadDrag = document.getElementById('herouploaddrag');
    if (heroUploadDrag) {
      heroUploadDrag.addEventListener('dragover', (e) => {
        e.preventDefault();
        heroUploadDrag.style.border = '2px dashed #4CAF50';
        heroUploadDrag.style.background = '#f0fff0';
      });

      heroUploadDrag.addEventListener('dragleave', (e) => {
        e.preventDefault();
        heroUploadDrag.style.border = '';
        heroUploadDrag.style.background = '';
      });

      heroUploadDrag.addEventListener('drop', (e) => {
        e.preventDefault();
        heroUploadDrag.style.border = '';
        heroUploadDrag.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          heroImageFile = file;
          updateHeroUploadUI(file.name);
        } else {
          alert('Please drop a valid image file.');
        }
      });
    }

    function updateHeroUploadUI(filename) {
      if (heroUploadDrag) {
        heroUploadDrag.innerHTML = '';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-gray-700 text-base mb-2';
        nameDiv.textContent = filename;
        heroUploadDrag.appendChild(nameDiv);
        const selectBtn = document.createElement('button');
        selectBtn.type = 'button';
        selectBtn.className = 'mt-2 px-3 py-1 bg-white border border-gray-300 rounded text-[#21C97B] text-sm font-medium shadow';
        selectBtn.textContent = 'Select another file';
        selectBtn.onclick = function() {
          if (heroUploadBtn) heroUploadBtn.click();
        };
        heroUploadDrag.appendChild(selectBtn);
      }
    }

    const heroForm = document.getElementById('heroform');
    if (heroForm) {
      // Create loader element
      const loader = document.createElement('div');
      loader.id = 'heroform-loader';
      loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50';
      loader.innerHTML = '<div class="bg-white rounded-lg px-6 py-4 shadow text-lg font-semibold flex items-center"><svg class="animate-spin mr-2 h-6 w-6 text-[#21C97B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>Saving...</div>';
      heroForm.onsubmit = async function(e) {
        e.preventDefault();
        const headline = document.getElementById('headline').value.trim();
        const subtext = document.getElementById('subtext').value.trim();
        if (!headline || !subtext || !heroImageFile) {
          alert('Please fill in all fields and select an image.');
          return;
        }
        document.body.appendChild(loader);
        let imageUrl = '';
        if (heroImageFile) {
          const storageRef = ref(storage, 'heroImages/' + Date.now() + '_' + heroImageFile.name);
          await uploadBytes(storageRef, heroImageFile);
          imageUrl = await getDownloadURL(storageRef);
        }
        // Get the first doc in heroSection, or create one if none exists
        const heroSectionSnap = await getDocs(collection(db, "heroSection"));
        let docId;
        if (!heroSectionSnap.empty) {
          docId = heroSectionSnap.docs[0].id;
        } else {
          docId = "main";
        }
        await setDoc(doc(db, "heroSection", docId), {
          headline,
          subtext,
          imageUrl
        });
        document.body.removeChild(loader);
        alert('Hero Section saved!');
      };
    }

    // Social Proof Section
    const socialForm = document.querySelectorAll('form')[1];
    if (socialForm) {
      socialForm.onsubmit = async function(e) {
        e.preventDefault();
        const video = document.getElementById('video').value;
        const students = document.getElementById('students').value;
        const earnings = document.getElementById('earnings').value;
        const subtext = document.getElementById('social-subtext').value;
        await addDoc(collection(db, "socialProof"), {
          video,
          students,
          earnings,
          subtext
        });
        alert('Social Proof saved!');
      };
    }

    // Packages Section
    const packageForm = document.querySelectorAll('form')[2];
    if (packageForm) {
      packageForm.onsubmit = async function(e) {
        e.preventDefault();
        const headline = document.getElementById('package-headline').value;
        const subtext = document.getElementById('package-subtext').value;
        const price = document.getElementById('package-price').value;
        // Features: get all feature inputs
        const features = Array.from(packageForm.querySelectorAll('input[type="text"]')).slice(3).map(f => f.value);
        await addDoc(collection(db, "packages"), {
          headline,
          subtext,
          price,
          features
        });
        alert('Package saved!');
      };
    }

    // Why Choose Acorn Section
    const whyForm = document.querySelectorAll('form')[3];
    if (whyForm) {
      whyForm.onsubmit = async function(e) {
        e.preventDefault();
        const section1Headline = document.getElementById('section1-headline').value;
        const section1Subtext = document.getElementById('section1-subtext').value;
        const section2Headline = document.getElementById('section2-headline').value;
        const section2Subtext = document.getElementById('section2-subtext').value;
        await addDoc(collection(db, "whyChooseAcorn"), {
          section1Headline,
          section1Subtext,
          section2Headline,
          section2Subtext
        });
        alert('Why Choose Acorn saved!');
      };
    }

    // Testimonials Management Section
    const testimonialForm = document.querySelectorAll('form')[4];
    if (testimonialForm) {
      testimonialForm.onsubmit = async function(e) {
        e.preventDefault();
        const text = document.getElementById('testimonial-text').value;
        const authorName = document.getElementById('author-name').value;
        const authorTitle = document.getElementById('author-title').value;
        const monthlyRevenue = document.getElementById('monthly-revenue').value;
        await addDoc(collection(db, "testimonials"), {
          text,
          authorName,
          authorTitle,
          monthlyRevenue
        });
        alert('Testimonial saved!');
      };
    }

    // FAQ Management Section
    const faqForm = document.querySelectorAll('form')[5];
    if (faqForm) {
      faqForm.onsubmit = async function(e) {
        e.preventDefault();
        const question = document.getElementById('faq-question').value;
        const answer = document.getElementById('faq-answer').value;
        await addDoc(collection(db, "faqs"), {
          question,
          answer
        });
        alert('FAQ saved!');
      };
    }
  });


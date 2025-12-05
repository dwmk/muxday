// State Management
let currentUser = null;
let currentProject = null;
let htmlEditor, cssEditor, jsEditor;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    initializeRouting();
    initializeEventListeners();
    checkAuthState();
});

// Authentication
async function initializeAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        await handleAuthStateChange(session);
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            await handleAuthStateChange(session);
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            updateUIForAuthState();
            navigate('/');
        }
    });
}

async function handleAuthStateChange(session) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
    
    currentUser = profile;
    updateUIForAuthState();
}

function updateUIForAuthState() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const createProjectBtn = document.getElementById('createProjectBtn');
    const myProjectsBtn = document.getElementById('myProjectsBtn');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.style.display = 'block';
        createProjectBtn.style.display = 'block';
        myProjectsBtn.style.display = 'block';
        
        const navAvatar = document.getElementById('navAvatar');
        navAvatar.src = currentUser.avatar_url || `${APP_CONFIG.defaultAvatar}${currentUser.username}`;
        
        const profileLink = document.getElementById('profileLink');
        profileLink.href = `/${currentUser.username}`;
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        userMenu.style.display = 'none';
        createProjectBtn.style.display = 'none';
        myProjectsBtn.style.display = 'none';
    }
}

async function checkAuthState() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        currentUser = profile;
        updateUIForAuthState();
    }
}

// Event Listeners
function initializeEventListeners() {
    // Auth Modals
    document.getElementById('loginBtn').addEventListener('click', () => openAuthModal('login'));
    document.getElementById('signupBtn').addEventListener('click', () => openAuthModal('signup'));
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Auth Forms
    document.getElementById('loginSubmit').addEventListener('click', handleLogin);
    document.getElementById('signupSubmit').addEventListener('click', handleSignup);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation
    document.getElementById('heroGetStarted').addEventListener('click', () => {
        if (currentUser) {
            navigate('/editor');
        } else {
            openAuthModal('signup');
        }
    });
    
    document.getElementById('createProjectBtn').addEventListener('click', () => navigate('/editor'));
    document.getElementById('myProjectsBtn').addEventListener('click', () => {
        if (currentUser) navigate(`/${currentUser.username}`);
    });
    
    // Editor
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('runCodeBtn').addEventListener('click', runCode);
    document.getElementById('shareProjectBtn').addEventListener('click', shareProject);
    document.getElementById('refreshPreview').addEventListener('click', runCode);
    
    // Profile
    document.getElementById('editProfileBtn').addEventListener('click', openEditProfileModal);
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
    
    // Project View
    document.getElementById('toggleCodeBtn').addEventListener('click', toggleCodeDisplay);
    document.getElementById('forkProjectBtn').addEventListener('click', forkProject);
    
    // Mobile Menu
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileMenu);
    
    // Modal Close
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Routing
function initializeRouting() {
    window.addEventListener('popstate', handleRoute);
    handleRoute();
}

function navigate(path) {
    history.pushState({}, '', path);
    handleRoute();
}

async function handleRoute() {
    const path = window.location.pathname;
    hideAllPages();
    
    if (path === '/' || path === '') {
        showHomePage();
    } else if (path === '/editor') {
        showEditorPage();
    } else {
        const parts = path.split('/').filter(p => p);
        if (parts.length === 1) {
            await showProfilePage(parts[0]);
        } else if (parts.length === 2) {
            await showProjectViewPage(parts[0], parts[1]);
        }
    }
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
}

function showHomePage() {
    document.getElementById('homePage').style.display = 'block';
    loadTrendingProjects();
}

function showEditorPage() {
    if (!currentUser) {
        openAuthModal('login');
        navigate('/');
        return;
    }
    
    document.getElementById('editorPage').style.display = 'block';
    initializeEditors();
    
    // Check if editing existing project
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    if (projectId) {
        loadProjectInEditor(projectId);
    } else {
        currentProject = null;
        clearEditors();
    }
}

async function showProfilePage(username) {
    document.getElementById('profilePage').style.display = 'block';
    await loadProfile(username);
}

async function showProjectViewPage(username, projectSlug) {
    document.getElementById('projectViewPage').style.display = 'block';
    await loadProjectView(username, projectSlug);
}

// Auth Functions
function openAuthModal(mode) {
    const modal = document.getElementById('authModal');
    modal.style.display = 'block';
    if (mode === 'login') {
        showLoginForm();
    } else {
        showSignupForm();
    }
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        document.getElementById('authModal').style.display = 'none';
        navigate('/');
    }
}

async function handleSignup() {
    const username = document.getElementById('signupUsername').value.toLowerCase().trim();
    const displayName = document.getElementById('signupDisplayName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Check if username exists
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
    
    if (existingUser) {
        alert('Username already taken');
        return;
    }
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
        alert('Signup failed: ' + error.message);
    } else {
        // Create profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                username,
                display_name: displayName,
                avatar_url: `${APP_CONFIG.defaultAvatar}${username}`
            });
        
        if (profileError) {
            alert('Profile creation failed: ' + profileError.message);
        } else {
            document.getElementById('authModal').style.display = 'none';
            alert('Account created! Please check your email to verify.');
        }
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    currentUser = null;
    updateUIForAuthState();
    navigate('/');
}

// Editor Functions
function initializeEditors() {
    if (htmlEditor) return; // Already initialized
    
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true
    });
    
    cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
        mode: 'css',
        theme: 'material-darker',
        lineNumbers: true,
        autoCloseBrackets: true
    });
    
    jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
        mode: 'javascript',
        theme: 'material-darker',
        lineNumbers: true,
        autoCloseBrackets: true
    });
    
    // Auto-run on change with debounce
    let timeout;
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.on('change', () => {
            clearTimeout(timeout);
            timeout = setTimeout(runCode, 1000);
        });
    });
}

function clearEditors() {
    document.getElementById('projectTitle').value = '';
    if (htmlEditor) htmlEditor.setValue('');
    if (cssEditor) cssEditor.setValue('');
    if (jsEditor) jsEditor.setValue('');
    runCode();
}

function runCode() {
    const html = htmlEditor ? htmlEditor.getValue() : '';
    const css = cssEditor ? cssEditor.getValue() : '';
    const js = jsEditor ? jsEditor.getValue() : '';
    
    const output = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;
    
    const iframe = document.getElementById('previewFrame');
    iframe.srcdoc = output;
}

async function saveProject() {
    if (!currentUser) {
        alert('Please login to save projects');
        return;
    }
    
    const title = document.getElementById('projectTitle').value || 'Untitled Project';
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const projectData = {
        title,
        slug,
        html_code: html,
        css_code: css,
        js_code: js,
        user_id: currentUser.id,
        is_public: true
    };
    
    if (currentProject) {
        // Update existing
        const { error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', currentProject.id);
        
        if (error) {
            alert('Failed to save: ' + error.message);
        } else {
            alert('Project saved!');
        }
    } else {
        // Create new
        const { data, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();
        
        if (error) {
            alert('Failed to save: ' + error.message);
        } else {
            currentProject = data;
            alert('Project created!');
            navigate(`/editor?id=${data.id}`);
        }
    }
}

async function loadProjectInEditor(projectId) {
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
    
    if (error || !project) {
        alert('Project not found');
        return;
    }
    
    if (project.user_id !== currentUser.id) {
        alert('You do not have permission to edit this project');
        navigate('/');
        return;
    }
    
    currentProject = project;
    document.getElementById('projectTitle').value = project.title;
    htmlEditor.setValue(project.html_code || '');
    cssEditor.setValue(project.css_code || '');
    jsEditor.setValue(project.js_code || '');
    runCode();
}

function shareProject() {
    if (!currentProject) {
        alert('Please save the project first');
        return;
    }
    
    const url = `${APP_CONFIG.siteUrl}/${currentUser.username}/${currentProject.slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
}

// Profile Functions
async function loadProfile(username) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
    
    if (error || !profile) {
        alert('User not found');
        navigate('/');
        return;
    }
    
    // Update profile display
    document.getElementById('profileDisplayName').textContent = profile.display_name;
    document.getElementById('profileUsername').textContent = `@${profile.username}`;
    document.getElementById('profileBio').textContent = profile.bio || '';
    document.getElementById('profileAvatar').src = profile.avatar_url || `${APP_CONFIG.defaultAvatar}${profile.username}`;
    
    const banner = document.getElementById('profileBanner');
    if (profile.banner_url) {
        banner.style.backgroundImage = `url(${profile.banner_url})`;
    } else {
        banner.style.background = APP_CONFIG.defaultBanner;
    }
    
    if (profile.is_verified) {
        document.getElementById('verifiedBadge').style.display = 'inline-flex';
    }
    
    // Social links
    const socialContainer = document.getElementById('profileSocial');
    socialContainer.innerHTML = '';
    
    const socials = [
        { key: 'github_url', label: 'GitHub', icon: '🐙' },
        { key: 'codepen_url', label: 'CodePen', icon: '🖊️' },
        { key: 'linkedin_url', label: 'LinkedIn', icon: '💼' },
        { key: 'instagram_url', label: 'Instagram', icon: '📷' },
        { key: 'discord_username', label: 'Discord', icon: '💬' }
    ];
    
    socials.forEach(social => {
        if (profile[social.key]) {
            const link = document.createElement('a');
            link.href = social.key === 'discord_username' ? '#' : profile[social.key];
            link.className = 'social-link';
            link.textContent = `${social.icon} ${social.label}`;
            if (social.key === 'discord_username') {
                link.title = profile[social.key];
            }
            socialContainer.appendChild(link);
        }
    });
    
    // Show edit button if own profile
    if (currentUser && currentUser.id === profile.id) {
        document.getElementById('editProfileBtn').style.display = 'block';
    } else {
        document.getElementById('editProfileBtn').style.display = 'none';
    }
    
    // Load user projects
    await loadUserProjects(profile.id);
}

async function loadUserProjects(userId) {
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
    
    const container = document.getElementById('userProjects');
    container.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<div class="loading">No projects yet</div>';
        return;
    }
    
    projects.forEach(project => {
        container.appendChild(createProjectCard(project));
    });
}

async function loadTrendingProjects() {
    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            *,
            profiles (username, display_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('views', { ascending: false })
        .limit(12);
    
    const container = document.getElementById('trendingProjects');
    container.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<div class="loading">No projects yet</div>';
        return;
    }
    
    projects.forEach(project => {
        container.appendChild(createProjectCard(project));
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => navigate(`/${project.profiles.username}/${project.slug}`);
    
    const output = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${project.css_code || ''}</style>
        </head>
        <body>
            ${project.html_code || ''}
            <script>${project.js_code || ''}<\/script>
        </body>
        </html>
    `;
    
    card.innerHTML = `
        <div class="project-thumbnail">
            <iframe srcdoc="${output.replace(/"/g, '&quot;')}" sandbox="allow-scripts"></iframe>
        </div>
        <div class="project-card-content">
            <h3 class="project-card-title">${project.title}</h3>
            <a href="/${project.profiles.username}" class="project-card-author" onclick="event.stopPropagation();">
                @${project.profiles.username}
            </a>
            <div class="project-card-stats">
                <span>👁️ ${project.views || 0}</span>
            </div>
        </div>
    `;
    
    return card;
}

async function loadProjectView(username, projectSlug) {
    const { data: project, error } = await supabase
        .from('projects')
        .select(`
            *,
            profiles (username, display_name, avatar_url)
        `)
        .eq('slug', projectSlug)
        .eq('profiles.username', username)
        .single();
    
    if (error || !project) {
        alert('Project not found');
        navigate('/');
        return;
    }
    
    // Increment view count and track analytics
    await trackProjectView(project.id);
    
    // Display project
    document.getElementById('viewProjectTitle').textContent = project.title;
    document.getElementById('viewProjectAuthor').textContent = `@${project.profiles.username}`;
    document.getElementById('viewProjectAuthor').href = `/${project.profiles.username}`;
    document.getElementById('viewProjectViews').textContent = project.views + 1;
    
    const output = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${project.css_code || ''}</style>
            <meta property="og:title" content="${project.title}">
            <meta property="og:description" content="Created by ${project.profiles.display_name}">
            <meta property="og:type" content="website">
        </head>
        <body>
            ${project.html_code || ''}
            <script>${project.js_code || ''}<\/script>
        </body>
        </html>
    `;
    
    document.getElementById('projectViewFrame').srcdoc = output;
    
    // Display code
    document.getElementById('displayHtml').textContent = project.html_code || '';
    document.getElementById('displayCss').textContent = project.css_code || '';
    document.getElementById('displayJs').textContent = project.js_code || '';
    
    // Show edit button if owner
    if (currentUser && currentUser.id === project.user_id) {
        document.getElementById('editProjectBtn').style.display = 'block';
        document.getElementById('editProjectBtn').onclick = () => navigate(`/editor?id=${project.id}`);
    } else {
        document.getElementById('editProjectBtn').style.display = 'none';
    }
    
    currentProject = project;
}

async function trackProjectView(projectId) {
    // Increment view count
    const { data: project } = await supabase
        .from('projects')
        .select('views')
        .eq('id', projectId)
        .single();
    
    await supabase
        .from('projects')
        .update({ views: (project.views || 0) + 1 })
        .eq('id', projectId);
    
    // Track in analytics
    const visitorId = getOrCreateVisitorId();
    await supabase
        .from('project_analytics')
        .insert({
            project_id: projectId,
            visitor_id: visitorId,
            viewed_at: new Date().toISOString()
        });
}

function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('muxday_visitor_id');
    if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('muxday_visitor_id', visitorId);
    }
    return visitorId;
}

function toggleCodeDisplay() {
    const codeDisplay = document.getElementById('codeDisplay');
    const btn = document.getElementById('toggleCodeBtn');
    if (codeDisplay.style.display === 'none') {
        codeDisplay.style.display = 'block';
        btn.textContent = 'Hide Code';
    } else {
        codeDisplay.style.display = 'none';
        btn.textContent = 'View Code';
    }
}

async function forkProject() {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }
    
    if (!currentProject) return;
    
    const { data, error } = await supabase
        .from('projects')
        .insert({
            title: `${currentProject.title} (Fork)`,
            slug: `${currentProject.slug}-fork-${Date.now()}`,
            html_code: currentProject.html_code,
            css_code: currentProject.css_code,
            js_code: currentProject.js_code,
            user_id: currentUser.id,
            forked_from: currentProject.id,
            is_public: true
        })
        .select()
        .single();
    
    if (error) {
        alert('Failed to fork: ' + error.message);
    } else {
        navigate(`/editor?id=${data.id}`);
    }
}

// Profile Editing
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'block';
    
    // Pre-fill form
    document.getElementById('editDisplayName').value = currentUser.display_name || '';
    document.getElementById('editBio').value = currentUser.bio || '';
    document.getElementById('editGithub').value = currentUser.github_url || '';
    document.getElementById('editCodepen').value = currentUser.codepen_url || '';
    document.getElementById('editLinkedin').value = currentUser.linkedin_url || '';
    document.getElementById('editInstagram').value = currentUser.instagram_url || '';
    document.getElementById('editDiscord').value = currentUser.discord_username || '';
}

async function handleEditProfile(e) {
    e.preventDefault();
    
    const displayName = document.getElementById('editDisplayName').value;
    const bio = document.getElementById('editBio').value;
    const github = document.getElementById('editGithub').value;
    const codepen = document.getElementById('editCodepen').value;
    const linkedin = document.getElementById('editLinkedin').value;
    const instagram = document.getElementById('editInstagram').value;
    const discord = document.getElementById('editDiscord').value;
    
    let avatarUrl = document.getElementById('editAvatarUrl').value;
    let bannerUrl = document.getElementById('editBannerUrl').value;
    
    // Handle avatar upload
    const avatarFile = document.getElementById('editAvatarFile').files[0];
    if (avatarFile) {
        const fileName = `${currentUser.id}/avatar_${Date.now()}.${avatarFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, avatarFile);
        
        if (!uploadError) {
            const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
            avatarUrl = data.publicUrl;
        }
    }
    
    // Handle banner upload
    const bannerFile = document.getElementById('editBannerFile').files[0];
    if (bannerFile) {
        const fileName = `${currentUser.id}/banner_${Date.now()}.${bannerFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, bannerFile);
        
        if (!uploadError) {
            const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
            bannerUrl = data.publicUrl;
        }
    }
    
    const updateData = {
        display_name: displayName,
        bio,
        github_url: github,
        codepen_url: codepen,
        linkedin_url: linkedin,
        instagram_url: instagram,
        discord_username: discord
    };
    
    if (avatarUrl) updateData.avatar_url = avatarUrl;
    if (bannerUrl) updateData.banner_url = bannerUrl;
    
    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUser.id);
    
    if (error) {
        alert('Failed to update profile: ' + error.message);
    } else {
        currentUser = { ...currentUser, ...updateData };
        document.getElementById('editProfileModal').style.display = 'none';
        alert('Profile updated!');
        navigate(`/${currentUser.username}`);
        loadProfile(currentUser.username);
    }
}

// Mobile Menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}
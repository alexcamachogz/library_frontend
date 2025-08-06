import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      library: 'Library',
      statistics: 'Statistics',
      settings: 'Settings',
      
      // Authentication
      signIn: 'Sign In',
      signOut: 'Sign Out',
      signInWithGoogle: 'Sign in with Google',
      welcome: 'Welcome',
      goodbye: 'Goodbye',
      signingIn: 'Signing in...',
      continueWithGoogle: 'Continue with Google',
      signedInAs: 'Signed in as',
      signedOutSuccessfully: 'You have signed out successfully',
      accessDenied: 'Access Denied',
      noAuthorization: 'You do not have authorization to access this application',
      couldNotSignInGoogle: 'Could not sign in with Google. Please try again',
      accessDeniedMessage: 'Access denied. Contact the administrator for access',
      
      // Book management
      addBook: 'Add Book',
      editBook: 'Edit Book',
      deleteBook: 'Delete Book',
      searchBooks: 'Search books...',
      noBooks: 'No books found',
      
      // Search functionality
      search: 'Search',
      filters: 'Filters',
      advancedSearch: 'Advanced Search',
      clear: 'Clear',
      searchByTitle: 'Search by title...',
      searchByAuthor: 'Search by author...',
      searchByCategory: 'Search by category...',
      category: 'Category',
      readingStatus: 'Reading Status',
      allStatuses: 'All statuses',
      
      // Book details
      title: 'Title',
      author: 'Author',
      pages: 'Pages',
      status: 'Status',
      description: 'Description',
      coverUrl: 'Cover URL',
      
      // Status options
      toRead: 'Unread',
      reading: 'Reading',
      completed: 'Read',
      
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      
      // Statistics
      totalBooks: 'Total Books',
      booksRead: 'Books Read',
      pagesRead: 'Pages Read',
      currentlyReading: 'Currently Reading',
      readingNow: 'Reading Now',
      totalProgress: 'Total Progress',
      readPercentage: 'Read Percentage',
      inYourLibrary: 'In your library',
      pending: 'Pending',
      read: 'Read',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Messages and notifications
      authRequiredUpdateStatus: 'Please sign in to update book status',
      authRequiredDelete: 'Please sign in to delete books',
      authRequiredEdit: 'Please sign in to edit books',
      bookMarkedAs: 'Book marked as',
      couldNotUpdateStatus: 'Could not update status',
      bookDeleted: 'Book has been deleted from your library',
      couldNotDeleteBook: 'Could not delete book',
      
      // Welcome messages
      welcomeToLibrary: 'Welcome to my library',
      libraryDescription: 'Each book here holds a story, a lesson or a moment.',
      welcomeDescription: 'Each book here holds a story, a lesson or a moment. Welcome to my personal literary universe.',
      
      // Pagination
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
      
      // Empty states
      noBooksMatchingCriteria: 'No books found with current search criteria',
      signInToManageCollection: 'Sign in to manage your book collection',
      
      // Book card interactions
      changeFrom: 'Change from',
      to: 'to',
      signInToUpdateReadingStatus: 'Sign in to update reading status',
      viewDetails: 'View details',
      signInToEdit: 'Sign in to edit',
      signInToDeleteBooks: 'Sign in to delete books',
      
      // Add Book Dialog
      addBookTrigger: 'Add Book',
      addBookTitle: 'Add New Book',
      addBookSubmit: 'Add Book',
      byISBN: 'By ISBN',
      manualEntry: 'Manual Entry',
      
      // Form fields
      isbnRequired: 'ISBN *',
      titleRequired: 'Title *',
      authorsRequired: 'Authors *',
      descriptionField: 'Description',
      coverImageField: 'Cover Image URL',
      categoriesField: 'Categories',
      publisherField: 'Publisher',
      pagesField: 'Pages',
      publishedDateField: 'Published Date',
      languageField: 'Language',
      readingStatusField: 'Reading Status',
      
      // Placeholders
      exampleISBN: 'e.g. 9780439708180',
      bookTitle: 'Book title',
      addAuthorPlaceholder: 'Add author...',
      bookDescription: 'Book description...',
      coverImageUrl: 'https://example.com/image.jpg',
      addCategoryPlaceholder: 'Add category...',
      publisherName: 'Publisher name',
      numberOfPages: 'Number of pages',
      languageCodes: 'es, en, fr...',
      
      // Help text
      isbnHelp: 'Enter the 10 or 13 digit ISBN of the book',
      
      // Reading status options
      unreadStatus: '📖 Unread',
      inProgressStatus: '🕐 Reading',
      readStatus: '✅ Read',
      
      // Add book messages
      invalidISBN: 'Please enter a valid ISBN',
      bookAddedTitle: 'Book Added',
      bookAddedDescription: 'The book has been successfully added to your library',
      couldNotAddBook: 'Could not add the book',
      titleAndISBNRequired: 'Title and ISBN are required',
      authorRequired: 'At least one author is required',
      
      // Cover preview
      coverPreviewAlt: 'Cover preview',
      
      // Book Detail Dialog
      bookDetails: 'Book Details',
      bookInformation: 'Book Information',
      publicationDate: 'Publication Date',
      
      // Edit Book Dialog
      bookUpdatedTitle: 'Book Updated',
      bookUpdatedDescription: 'Changes have been successfully saved',
      couldNotUpdateBook: 'Could not update the book',
      saveChanges: 'Save Changes'
    }
  },
  es: {
    translation: {
      // Navigation
      library: 'Biblioteca',
      statistics: 'Estadísticas',
      settings: 'Configuración',
      
      // Authentication
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      signInWithGoogle: 'Iniciar sesión con Google',
      welcome: 'Bienvenida',
      goodbye: 'Hasta luego',
      signingIn: 'Iniciando sesión...',
      continueWithGoogle: 'Continuar con Google',
      signedInAs: 'Iniciaste sesión como',
      signedOutSuccessfully: 'Cerraste sesión de forma exitosa',
      accessDenied: 'Acceso Denegado',
      noAuthorization: 'No tienes autorización para acceder a esta aplicación',
      couldNotSignInGoogle: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo',
      accessDeniedMessage: 'Acceso denegado. Contacta al administrador para obtener acceso',
      
      // Book management
      addBook: 'Agregar Libro',
      editBook: 'Editar Libro',
      deleteBook: 'Eliminar Libro',
      searchBooks: 'Buscar libros...',
      noBooks: 'No se encontraron libros',
      
      // Search functionality
      search: 'Buscar',
      filters: 'Filtros',
      advancedSearch: 'Búsqueda Avanzada',
      clear: 'Limpiar',
      searchByTitle: 'Buscar por título...',
      searchByAuthor: 'Buscar por autor...',
      searchByCategory: 'Buscar por categoría...',
      category: 'Categoría',
      readingStatus: 'Estado de Lectura',
      allStatuses: 'Todos los estados',
      
      // Book details
      title: 'Título',
      author: 'Autor',
      pages: 'Páginas',
      status: 'Estado',
      description: 'Descripción',
      coverUrl: 'URL de Portada',
      
      // Status options
      toRead: 'No Leído',
      reading: 'Leyendo',
      completed: 'Leído',
      
      // Actions
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      
      // Statistics
      totalBooks: 'Total de Libros',
      booksRead: 'Libros Leídos',
      pagesRead: 'Páginas Leídas',
      currentlyReading: 'Leyendo Actualmente',
      readingNow: 'Leyendo Ahora',
      totalProgress: 'Progreso Total',
      readPercentage: 'Porcentaje Leído',
      inYourLibrary: 'En tu biblioteca',
      pending: 'Pendientes',
      read: 'Leídos',
      
      // Common
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      
      // Messages and notifications
      authRequiredUpdateStatus: 'Por favor inicia sesión para actualizar el estado del libro',
      authRequiredDelete: 'Por favor inicia sesión para eliminar libros',
      authRequiredEdit: 'Por favor inicia sesión para editar libros',
      bookMarkedAs: 'Libro marcado como',
      couldNotUpdateStatus: 'No se pudo actualizar el estado',
      bookDeleted: 'El libro ha sido eliminado de tu biblioteca',
      couldNotDeleteBook: 'No se pudo eliminar el libro',
      
      // Welcome messages
      welcomeToLibrary: 'Bienvenida a mi biblioteca',
      libraryDescription: 'Cada libro aquí guarda una historia, una lección o un momento.',
      welcomeDescription: 'Cada libro aquí guarda una historia, una lección o un momento. Bienvenida a mi universo literario personal.',
      
      // Pagination
      page: 'Página',
      of: 'de',
      previous: 'Anterior',
      next: 'Siguiente',
      
      // Empty states
      noBooksMatchingCriteria: 'No se encontraron libros con los criterios de búsqueda actuales',
      signInToManageCollection: 'Inicia sesión para administrar tu colección de libros',
      
      // Book card interactions
      changeFrom: 'Cambiar de',
      to: 'a',
      signInToUpdateReadingStatus: 'Inicia sesión para actualizar el estado de lectura',
      viewDetails: 'Ver detalles',
      signInToEdit: 'Inicia sesión para editar',
      signInToDeleteBooks: 'Inicia sesión para borrar libros',
      
      // Add Book Dialog
      addBookTrigger: 'Agregar Libro',
      addBookTitle: 'Agregar Nuevo Libro',
      addBookSubmit: 'Agregar Libro',
      byISBN: 'Por ISBN',
      manualEntry: 'Entrada Manual',
      
      // Form fields
      isbnRequired: 'ISBN *',
      titleRequired: 'Título *',
      authorsRequired: 'Autores *',
      descriptionField: 'Descripción',
      coverImageField: 'URL de Imagen de Portada',
      categoriesField: 'Categorías',
      publisherField: 'Editorial',
      pagesField: 'Páginas',
      publishedDateField: 'Fecha de Publicación',
      languageField: 'Idioma',
      readingStatusField: 'Estado de Lectura',
      
      // Placeholders
      exampleISBN: 'ej. 9780439708180',
      bookTitle: 'Título del libro',
      addAuthorPlaceholder: 'Agregar autor...',
      bookDescription: 'Descripción del libro...',
      coverImageUrl: 'https://ejemplo.com/imagen.jpg',
      addCategoryPlaceholder: 'Agregar categoría...',
      publisherName: 'Nombre de la editorial',
      numberOfPages: 'Número de páginas',
      languageCodes: 'es, en, fr...',
      
      // Help text
      isbnHelp: 'Ingresa el ISBN de 10 o 13 dígitos del libro',
      
      // Reading status options
      unreadStatus: '📖 No leído',
      inProgressStatus: '🕐 Leyendo',
      readStatus: '✅ Leído',
      
      // Add book messages
      invalidISBN: 'Por favor ingresa un ISBN válido',
      bookAddedTitle: 'Libro agregado',
      bookAddedDescription: 'El libro ha sido agregado exitosamente a tu biblioteca',
      couldNotAddBook: 'No se pudo agregar el libro',
      titleAndISBNRequired: 'El título y el ISBN son requeridos',
      authorRequired: 'Se requiere al menos un autor',
      
      // Cover preview
      coverPreviewAlt: 'Vista previa de portada',
      
      // Book Detail Dialog
      bookDetails: 'Detalles del libro',
      bookInformation: 'Información del libro',
      publicationDate: 'Fecha de publicación',
      
      // Edit Book Dialog
      bookUpdatedTitle: 'Libro actualizado',
      bookUpdatedDescription: 'Los cambios han sido guardados exitosamente',
      couldNotUpdateBook: 'No se pudo actualizar el libro',
      saveChanges: 'Guardar Cambios'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
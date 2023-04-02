<ion-tabs>
	<ion-tab tab="home">
		<ion-nav id="home-nav"></ion-nav>
		<div id="home-page">
			<ion-header>
				<ion-toolbar>
					<ion-title>Home</ion-title>
					<ion-buttons slot="end">
    					<ion-button>
							<ion-icon name="share-outline"></ion-icon>
						</ion-button>
  					</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content>
				<div class="example-content">Home page</div>
			</ion-content>
		</div>
	</ion-tab>

	<ion-tab tab="library">
		<ion-nav id="library-nav"></ion-nav>
		<div id="library-page">
			<ion-header><ion-toolbar><ion-title>Library</ion-title></ion-toolbar></ion-header>
			<ion-content><div class="example-content">Library content</div></ion-content>
		</div>
	</ion-tab>

	<ion-tab tab="search">
		<ion-nav id="search-nav"></ion-nav>
		<div id="search-page">
			<ion-header><ion-toolbar><ion-title>Search</ion-title></ion-toolbar></ion-header>
			<ion-content><div class="example-content">Search content</div></ion-content>
		</div>
	</ion-tab>

	<ion-tab-bar slot="bottom">
		<ion-tab-button tab="home"><ion-icon name="home-outline"></ion-icon>Home</ion-tab-button>
		<ion-tab-button tab="library"><ion-icon name="library"></ion-icon> Library </ion-tab-button>
		<ion-tab-button tab="search"><ion-icon name="search"></ion-icon> Search </ion-tab-button>
	</ion-tab-bar>
  </ion-tabs>

<script>
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

toggleDarkTheme(prefersDark.matches);
function toggleDarkTheme (shouldAdd) {
	document.body.classList.toggle('dark', shouldAdd);
}

</script>

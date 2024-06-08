<script>
  import icon from '$lib/img/icon.svg'
</script>

<div id='main'>
  <div id='menu'>
    <img src={icon} alt="">
  </div>
  <div id='content'>
    <slot />
  </div>
</div>

<style>
  :global(body) {
    --background: #353330;
    --foreground: #f5f5f5;
    --color1: #ffd790;
    --color2: #a0f7ff;
    color: var(--foreground);
    background-color: var(--background);
    margin: 0;
    padding: 0;
  }
  :global(h1) {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 30px;
    font-weight: normal;
  }
  :global(form) {
    display: flex;
    flex-flow: column;
  }
  :global(input) {
    margin-bottom: 10px;
    background-color: var(--background);
    padding: 5px;
    color: var(--foreground);
    border: 2px solid #ffffff30;
    border-radius: 10px;
  }
  :global(input:focus) {
    outline: 2px solid var(--color1);
  }
  :global(button) {
    margin-top: 20px;
    background-color: var(--color2);
    color: var(--background);
    height: 50px;
    border-radius: 30px;
  }
  #main {
    display: flex;
  }
  #menu {
    display: flex;
    flex-flow: column;
    width: 50px;
    height: 100dvh;
    background-color: rgb(from var(--color1) r g b / 10%);
    img {
      filter: drop-shadow(1px 1px 0.5px var(--background));
      margin: 0 auto;
      padding: 5px;
      width: 80%;
    }
  }
  #content {
    flex-grow: 1;
    margin: 15px;
  }
</style>
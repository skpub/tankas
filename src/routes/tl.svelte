<script>
  const contents = ['value', 'value2']
</script>

<div id='TL'>
  {#each contents as content}
    <div class='tanka'>{content}</div>
  {/each}
  <!-- <button on:click={() => notify('test')}></button> -->
</div>

<style>
  #TL {
    width: 80%;
    margin: 0 auto;
    background-color: var(--background-contents);
  }
  .tanka {
    padding: 15px;
  }
</style>
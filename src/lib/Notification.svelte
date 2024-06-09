<script lang="ts">
  import { notifications } from '$lib/notificationStore'

  let currentNotifications: string[] = []

  $: notifications.subscribe(value => {
    currentNotifications = value
  });
</script>

<div class="notification_container">
  {#each currentNotifications as msg}
    <div class="notification">
      <p>{msg}</p>
    </div>
  {/each}
</div>

<style>
  .notification_container {
    color: var(--foreground);
    position: absolute;
    min-width: 200px;
    min-height: 100px;
    /* background-color: var(--background); */
    border-radius: 20px;
    top: 10px;
    right: 10px;
    translate: transform(-100%);
  }
  .notification {
    border-left: 3px solid var(--warning);
  }
  p {
    padding-left: 10px;
  }
</style>
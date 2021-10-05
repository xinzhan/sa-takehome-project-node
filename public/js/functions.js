   /**
   * xz todo notes:
   * @todo : server side process
   * 
   */
  
// get the config from server side
async function getConfig() {
  try {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
  } catch (err) {
    return {error: err.message};
  }
}

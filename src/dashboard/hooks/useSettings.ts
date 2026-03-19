export async function getAppSettings() {
    try {
      const res = await fetch('/_api/wix-data/v2/items/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataCollectionId: 'AppSettings',
          query: { paging: { limit: 1 } }
        })
      });
      const data = await res.json();
      return data?.dataItems?.[0]?.data || null;
    } catch (e) {
      console.error('getAppSettings error:', e);
      return null;
    }
  }
  
  export async function saveAppSettings(settings: any) {
    try {
      const method = settings._id ? 'PUT' : 'POST';
      const url = settings._id
        ? `/_api/wix-data/v2/items/${settings._id}`
        : `/_api/wix-data/v2/items`;
  
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataCollectionId: 'AppSettings',
          dataItem: { data: settings }
        })
      });
      return await res.json();
    } catch (e) {
      console.error('saveAppSettings error:', e);
      return null;
    }
  }
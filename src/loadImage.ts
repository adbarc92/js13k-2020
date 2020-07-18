{
  const images = [
    'https://i.imgur.com/M36x4jw.jpg',
    'https://i.imgur.com/6SfbJkg.jpg',
    'https://i.imgur.com/FW3ehVy.jpg',
    'https://i.imgur.com/MgZ4f35.jpg',
    'https://i.imgur.com/PoaqwIJ.png',
    // 'https://fakeurlthatdoesntwork',
  ];

  let isRendering = false;
  let nextRender: any = null;

  (window as any).doManualFadeInOut = () => {
    if (isRendering) {
      isRendering = false;
      nextRender = (window as any).doManualFadeInOut;
      return;
    }
    const img = document.getElementById('img_0');

    if (img) {
      img.style.transition = '';
      const ms = 500;
      // const startTime = +new Date();
      const startTime = performance.now();

      isRendering = true;
      const render = now => {
        // console.log(
        //   'startTime: ',
        //   startTime,
        //   'now:',
        //   now,
        //   'now-startTime:',
        //   now - startTime
        // );
        const elapsed = now - startTime;
        img.style.opacity = (1 - elapsed / 500).toString();
        if (elapsed < ms && isRendering) {
          requestAnimationFrame(render);
        } else {
          isRendering = false;
          img.style.opacity = '1';
          if (nextRender) {
            nextRender();
            nextRender = null;
          }
        }
      };
      render(startTime);
    }
  };

  (window as any).fadeOut = ev => {
    const img = document.getElementById('img_0');
    if (img) {
      img.style.opacity = '0';
    }
  };

  // This will be inconsistent, dependent on browser performance
  (window as any).doManualFadeOut = () => {
    const img = document.getElementById('img_0');
    console.log(img);
    if (img) {
      img.style.transition = '';
      const ms = 500;
      for (let i = 0; i < ms; i += 25) {
        setTimeout(() => {
          img.style.opacity = (1 - i / ms).toString();
        }, i);
      }
      setTimeout(() => {
        img.style.opacity = '1';
      }, ms);
    }
  };

  const loadImage = (url: string, index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      let p = document.createElement('P');
      p.innerText = 'Loading';
      p.style.color = 'white';
      document.body.append(p);
      let img = new Image();
      img.id = 'img_' + index;
      img.src = url;
      img.style.opacity = '1';
      img.style.transition = 'opacity 500ms';
      img.width = 512; // Aped
      // If image loads, resolve promise
      img.onload = () => {
        p.remove();
        resolve(img);
      };
      // If image fails to load, reject promise
      img.onerror = () => reject(new Error('Image failed to load'));
    });
  };

  const addImageToDom = async () => {
    window.addEventListener('transitionend', () => {
      const img = document.getElementById('img_0');
      if (img) {
        img.style.transition = '';
        console.log(img.style.transition);
        img.style.opacity = '1';
        // A setTimeout of zero forces the code to wait until the next tick, rather than continuing the thread
        setTimeout(() => {
          img.style.transition = 'opacity 500ms';
        }, 0);
      }
    });
    const image = await loadImage(images[0], 0);
    document.body.append(image);
  };

  document.body.style.backgroundColor = 'black';
  addImageToDom();
}

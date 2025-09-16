
    document.getElementById('videoSource').src = `/video.mp4`;
    document.getElementById('meuVideo').load();


    const videoElement = document.getElementById('input_video');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const meuVideo = document.getElementById('meuVideo');
    
    let podeClicar = true;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#0f0', lineWidth: 3});
          drawLandmarks(canvasCtx, landmarks, {color: '#f00', lineWidth: 2});

           
          // ---- dedos principais ----
          const margem = 0.01;
          const margemVolume = 0.02;

const indicadorEstendido = landmarks[8].y < landmarks[5].y + margem && // Ponta do dedo acima da base
                           landmarks[7].y < landmarks[5].y + margem && // Segunda dobra acima da base
                           landmarks[6].y < landmarks[5].y + margem && // Primeira dobra acima da base
                           landmarks[7].y < landmarks[6].y + margem;  // Segunda dobra acima da primeira dobra

const medioEstendido = landmarks[12].y < landmarks[9].y + margem &&
                       landmarks[11].y < landmarks[9].y + margem &&
                       landmarks[10].y < landmarks[9].y + margem &&
                       landmarks[11].y < landmarks[10].y + margem;

const anelarEstendido = landmarks[16].y < landmarks[13].y + margem &&
                        landmarks[15].y < landmarks[13].y + margem &&
                        landmarks[14].y < landmarks[13].y + margem &&
                        landmarks[15].y < landmarks[14].y + margem;

const minimoEstendido = landmarks[20].y < landmarks[17].y + margem &&
                        landmarks[19].y < landmarks[17].y + margem &&
                        landmarks[18].y < landmarks[17].y + margem &&
                        landmarks[19].y < landmarks[18].y + margem;

const polegarEstendido = landmarks[4].y < landmarks[1].y + margem &&
                         landmarks[3].y < landmarks[1].y + margem &&
                         landmarks[2].y < landmarks[1].y + margem &&
                         landmarks[4].y < landmarks[2].y + margem;

const dedosEstendidos = [indicadorEstendido, medioEstendido, anelarEstendido, minimoEstendido].filter(d => d).length;

          const maoHorizontalDireita = landmarks[5].x < landmarks[0].x - margem && landmarks[9].x < landmarks[0].x - margem && landmarks[13].x < landmarks[0].x - margem;
          const maoHorizontalEsquerda = landmarks[5].x > landmarks[0].x + margem && landmarks[9].x > landmarks[0].x + margem && landmarks[13].x > landmarks[0].x + margem;
          const maoVertical = landmarks[5].y < landmarks[0].y - margem || landmarks[9].y < landmarks[0].y - margem || landmarks[13].y < landmarks[0].y - margem;
          const xIndicador = landmarks[8].x;
          const xPolegar = landmarks[4].x;
          const yIndicador = landmarks[8].y;
          const yPolegar = landmarks[4].y;
          const ymedio = landmarks[10].y;
          const xmedio = landmarks[10].x;
          
          
          // ---- COMBINADAS PRIMEIRO ----

           if (maoHorizontalDireita && indicadorEstendido && polegarEstendido && xIndicador < xPolegar) {
                const distancia = Math.abs(landmarks[8].x - landmarks[4].x);
                const volume = Math.min(Math.max(distancia * 6, 0), 1);
                meuVideo.volume = volume;
                console.log("🔈🤏 Volume:", volume.toFixed(2));
                mostrarGesto(' 🔈<i class="fa-solid fa-hand-lizard" style="color: #FFD43B;"></i> Volume:' + volume.toFixed(2));
                setTimeout(() => { podeClicar = true; }, 1000);
            }

            else if (maoHorizontalDireita && indicadorEstendido && medioEstendido && yIndicador < ymedio && xmedio > xIndicador) {
              meuVideo.currentTime += 5;
              console.log("APONTAR DIREITA 👉");
              mostrarGesto('<i class="fa-solid fa-hand-point-right" style="color: #FFD43B;"></i> <br> AVANÇAR');
              setTimeout(() => { podeClicar = true; }, 1000);
            }

            else if (maoHorizontalEsquerda && indicadorEstendido && medioEstendido && yIndicador < ymedio && xmedio < xIndicador) {
              meuVideo.currentTime -= 5;
              console.log("APONTAR ESQUERDA 👈");
              mostrarGesto('<i class="fa-solid fa-hand-point-left" style="color: #FFD43B;"></i> <br>VOLTAR');
              setTimeout(() => { podeClicar = true; }, 1000);
            }
            
            else if (dedosEstendidos >=4 && maoVertical) {
              meuVideo.play();
              console.log("ABERTA 🖐️");
              mostrarGesto('<i class="fa-solid fa-hand" style="color: #FFD43B;"></i> <br> PLAY ');
            setTimeout(() => { podeClicar = true; }, 1000);
          }

            else if (dedosEstendidos === 0 && maoVertical) {
              meuVideo.pause();
              console.log("FECHADA 👊");
              mostrarGesto('<i class="fa-solid fa-hand-fist" style="color: #FFD43B;"></i> <br> PAUSE ');
            setTimeout(() => { podeClicar = true; }, 1000);
          }

      }
    }
  }
      canvasCtx.restore();
    

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 640,
      height: 480
    });
    camera.start();
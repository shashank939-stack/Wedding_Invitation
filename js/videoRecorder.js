/**
 * सिनेमैटिक वीडियो रिकॉर्डर एवं निर्यातक (Cinematic Video Exporter)
 * Uses HTML5 Canvas 2D and MediaRecorder API to render the complete wedding film
 * into a downloadable high-definition WebM/MP4 video file for WhatsApp sharing!
 */
class RoyalVideoRecorder {
  constructor(audioController) {
    this.audioController = audioController;
    this.canvas = document.getElementById('recordCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.isRecording = false;

    // Modal elements
    this.modal = document.getElementById('videoExportModal');
    this.statusText = document.getElementById('exportStatusText');
    this.progressFill = document.getElementById('exportProgressFill');
    this.readyActions = document.getElementById('exportReadyActions');
    this.downloadBtn = document.getElementById('btnDownloadVideoFile');
    this.closeBtn = document.getElementById('btnCloseExportModal');

    // Preload image assets for rendering
    this.images = {};
    this.loadAssets();
    this.bindEvents();
  }

  loadAssets() {
    const assets = {
      ganesha: 'assets/images/ganesha.jpg',
      palace: 'assets/images/palace_gate.jpg',
      rituals: 'assets/images/rituals.jpg',
      mandap: 'assets/images/mandap.jpg',
      pattern: 'assets/images/royal_pattern.jpg'
    };

    for (const [key, src] of Object.entries(assets)) {
      const img = new Image();
      img.src = src;
      this.images[key] = img;
    }
  }

  bindEvents() {
    const triggerBtn = document.getElementById('btnRecordVideo');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.startExport());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        if (this.modal) this.modal.classList.add('hidden');
      });
    }
  }

  startExport() {
    if (!window.MediaRecorder || !this.canvas) {
      alert('आपके ब्राउज़र में वीडियो रिकॉर्डर समर्थित नहीं है। कृपया आधुनिक Chrome या Edge ब्राउज़र में देखें।');
      return;
    }

    if (this.modal) {
      this.modal.classList.remove('hidden');
      if (this.readyActions) this.readyActions.classList.add('hidden');
      if (this.progressFill) this.progressFill.style.width = '0%';
      if (this.statusText) this.statusText.textContent = 'शाही दृश्य संजोए जा रहे हैं...';
    }

    this.isRecording = true;
    this.renderAndRecord();
  }

  renderAndRecord() {
    const canvasStream = this.canvas.captureStream(30); // 30 FPS
    let combinedStream = canvasStream;

    try {
      const audioEl = document.getElementById('weddingAudio');
      if (audioEl && (audioEl.captureStream || audioEl.mozCaptureStream)) {
        const audioStream = audioEl.captureStream ? audioEl.captureStream() : audioEl.mozCaptureStream();
        if (audioStream && audioStream.getAudioTracks().length > 0) {
          combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);
        }
      }
    } catch (e) {
      console.warn('Could not capture audio stream for video:', e);
    }

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 2500000 });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      if (this.downloadBtn) {
        this.downloadBtn.href = url;
      }
      if (this.statusText) this.statusText.textContent = 'वीडियो सफलतापूर्वक तैयार!';
      if (this.readyActions) this.readyActions.classList.remove('hidden');
      this.isRecording = false;
    };

    recorder.start();

    // 5 scenes x 3.5 seconds each in accelerated recording = ~18 seconds video
    const totalFrames = 30 * 18;
    let currentFrame = 0;

    const renderLoop = () => {
      if (!this.isRecording || currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const progress = currentFrame / totalFrames;
      if (this.progressFill) {
        this.progressFill.style.width = `${Math.round(progress * 100)}%`;
      }

      this.drawVideoFrame(progress, currentFrame);
      currentFrame++;
      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }

  drawVideoFrame(progress, frame) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Background base
    ctx.fillStyle = '#2B0309';
    ctx.fillRect(0, 0, w, h);

    // Scene 1: Ganesh Vandana (0% - 22%)
    if (progress < 0.22) {
      this.drawGaneshScene(ctx, w, h, progress / 0.22, frame);
    }
    // Scene 2: Couple Announcement (22% - 44%)
    else if (progress < 0.44) {
      this.drawCoupleScene(ctx, w, h, (progress - 0.22) / 0.22, frame);
    }
    // Scene 3: Rituals Montage (44% - 66%)
    else if (progress < 0.66) {
      this.drawRitualsScene(ctx, w, h, (progress - 0.44) / 0.22, frame);
    }
    // Scene 4: Grand Mandap (66% - 85%)
    else if (progress < 0.85) {
      this.drawMandapScene(ctx, w, h, (progress - 0.66) / 0.19, frame);
    }
    // Scene 5: Emotional Closing (85% - 100%)
    else {
      this.drawClosingScene(ctx, w, h, (progress - 0.85) / 0.15, frame);
    }

    // Outer Royal Gold Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.strokeStyle = 'rgba(255, 235, 150, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(22, 22, w - 44, h - 44);
  }

  drawGaneshScene(ctx, w, h, relT, frame) {
    // Backdrop
    ctx.fillStyle = '#3E050F';
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px "Rozha One", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ श्री गणेशाय नमः ॥', w / 2, 90);

    // Ganesha image
    if (this.images.ganesha && this.images.ganesha.complete) {
      const imgSize = 320;
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, 280, imgSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.images.ganesha, w / 2 - imgSize / 2, 280 - imgSize / 2, imgSize, imgSize);
      ctx.restore();

      // Golden ring
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(w / 2, 280, imgSize / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shloka
    ctx.fillStyle = '#FFF5D6';
    ctx.font = '26px "Tiro Devanagari Hindi", serif';
    ctx.fillText('वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', w / 2, 500);
    ctx.fillText('निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥', w / 2, 545);

    ctx.font = '22px "Rozha One", serif';
    ctx.fillStyle = '#F2C94C';
    ctx.fillText('॥ शुभ विवाह निमंत्रण ॥', w / 2, 630);
  }

  drawCoupleScene(ctx, w, h, relT, frame) {
    if (this.images.palace && this.images.palace.complete) {
      ctx.globalAlpha = 0.45;
      ctx.drawImage(this.images.palace, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = '28px "Yatra One", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('❦ दो परिवारों का पावन मिलन ❦', w / 2, 100);

    // Groom
    ctx.font = '22px "Yatra One", cursive';
    ctx.fillStyle = '#F9E29B';
    ctx.fillText('चिरंजीव', w / 2, 160);

    ctx.font = 'bold 52px "Rozha One", serif';
    ctx.fillStyle = '#FFFDF9';
    ctx.fillText('शशांक गुर्जर', w / 2, 225);

    ctx.font = '22px "Tiro Devanagari Hindi", serif';
    ctx.fillStyle = '#E5BE58';
    ctx.fillText('सुपुत्र: श्रीमती ज्ञानेश्वरी जी एवं श्री प्रवीणजी गुर्जर', w / 2, 275);

    // Sang
    ctx.font = 'bold 32px "Yatra One", cursive';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('— संग —', w / 2, 340);

    // Bride
    ctx.font = '22px "Yatra One", cursive';
    ctx.fillStyle = '#F9E29B';
    ctx.fillText('आयुष्मती', w / 2, 400);

    ctx.font = 'bold 52px "Rozha One", serif';
    ctx.fillStyle = '#FFFDF9';
    ctx.fillText('अर्चना पाण्डेय', w / 2, 465);

    ctx.font = '22px "Tiro Devanagari Hindi", serif';
    ctx.fillStyle = '#E5BE58';
    ctx.fillText('सुपुत्री: श्रीमती बाबिताजी पाण्डेय एवं श्री कृष्ण कुमार जी पाण्डेय', w / 2, 515);

    // Date
    ctx.font = 'bold 28px "Rozha One", serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('शुभ विवाह तिथि: 10 दिसंबर • स्थल: KRB, Kadola, Harda', w / 2, 620);
  }

  drawRitualsScene(ctx, w, h, relT, frame) {
    if (this.images.rituals && this.images.rituals.complete) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(this.images.rituals, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 34px "Rozha One", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ मांगलिक कार्यक्रमों की रूपरेखा ॥', w / 2, 90);

    const items = [
      { date: '7 दिसंबर', title: 'मिट्टी की रस्म', time: 'प्रातः 7:30 – 8:30 बजे' },
      { date: '8 दिसंबर', title: 'माता पूजन एवं गणेश पूजन', time: 'सायं 4:00 एवं 7:00 बजे' },
      { date: '9 दिसंबर', title: 'मंडप, हल्दी, सगाई, संगीत', time: 'प्रातः 7:30, अपराह्न 3:00, सायं 4:30' },
      { date: '10 दिसंबर', title: 'शुभ विवाह एवं स्वरुचि भोज', time: 'प्रातः 10:00 भोज, दोपहर 1:30 शादी, सायं 5:00 बारात' }
    ];

    items.forEach((item, idx) => {
      const y = 180 + idx * 115;
      ctx.fillStyle = 'rgba(30, 2, 7, 0.85)';
      ctx.strokeStyle = '#BF953F';
      ctx.lineWidth = 2;
      ctx.fillRect(140, y - 35, w - 280, 85);
      ctx.strokeRect(140, y - 35, w - 280, 85);

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px "Rozha One", serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.date + ' — ' + item.title, 180, y);

      ctx.fillStyle = '#FFF';
      ctx.font = '20px "Tiro Devanagari Hindi", serif';
      ctx.fillText('समय: ' + item.time, 180, y + 32);
    });
  }

  drawMandapScene(ctx, w, h, relT, frame) {
    if (this.images.mandap && this.images.mandap.complete) {
      ctx.globalAlpha = 0.55;
      ctx.drawImage(this.images.mandap, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px "Rozha One", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ पाणिग्रहण संस्कार ॥', w / 2, 120);

    ctx.font = 'bold 38px "Rozha One", serif';
    ctx.fillStyle = '#FFFDF9';
    ctx.fillText('“दो परिवारों का पावन मिलन,', w / 2, 240);
    ctx.fillText('प्रेम, विश्वास और नए जीवन का शुभारंभ।”', w / 2, 305);

    ctx.font = '24px "Tiro Devanagari Hindi", serif';
    ctx.fillStyle = '#F9E29B';
    ctx.fillText('सात जन्मों का पवित्र बंधन, वैदिक मंत्रोच्चार और शुभ आशीर्वाद।', w / 2, 420);

    ctx.font = 'bold 30px "Rozha One", serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('स्थल: KRB, Kadola, Harda', w / 2, 550);
  }

  drawClosingScene(ctx, w, h, relT, frame) {
    ctx.fillStyle = '#2B0309';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 44px "Rozha One", serif';
    ctx.textAlign = 'center';
    ctx.fillText('शशांक एवं अर्चना', w / 2, 110);

    ctx.font = '26px "Rozha One", serif';
    ctx.fillStyle = '#FFF5D6';
    ctx.fillText('“आपकी उपस्थिति हमारे लिए सम्मान,', w / 2, 190);
    ctx.fillText('आपका स्नेह हमारी खुशी,', w / 2, 235);
    ctx.fillText('और आपका आशीर्वाद हमारा सबसे अनमोल उपहार है।”', w / 2, 280);

    // Apology note
    ctx.fillStyle = 'rgba(60, 6, 16, 0.85)';
    ctx.fillRect(160, 320, w - 320, 160);
    ctx.strokeStyle = '#BF953F';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(160, 320, w - 320, 160);

    ctx.fillStyle = '#FDF8ED';
    ctx.font = '18px "Tiro Devanagari Hindi", serif';
    ctx.fillText('यदि यह निमंत्रण आप तक डिजिटल माध्यम से पहुँचा है और हम व्यक्तिगत रूप से', w / 2, 365);
    ctx.fillText('आपके घर आकर निमंत्रण नहीं दे पाए, तो कृपया हमारी इस त्रुटि को क्षमा करें।', w / 2, 395);
    ctx.fillText('कृपया पधारकर नवयुगल को अपना स्नेहिल आशीर्वाद प्रदान करें।', w / 2, 430);

    ctx.font = '22px "Yatra One", cursive';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('सादर आमंत्रित — गुर्जर एवं पाण्डेय परिवार', w / 2, 540);

    ctx.font = 'bold 32px "Yatra One", cursive';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('॥ शुभ विवाह ॥', w / 2, 610);
  }
}

window.RoyalVideoRecorder = RoyalVideoRecorder;

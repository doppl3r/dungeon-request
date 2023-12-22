import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import json from '../json/models.json';

class Models {
  constructor(manager) {
    this.cache = {};
    this.loader = new GLTFLoader(manager);
  }

  load() {
    for (const [key, value] of Object.entries(json)) {
      this.loader.load(value.url, function(gltf) {
        // Load model from gltf.scene Object3D (includes SkinnedMesh)
        var model = gltf.scene;
        model.name = key;
        model.animations = gltf.animations;
        model.userData = { ...value.userData };
        this.setShadows(model);
        this.applyUserData(model);
        this.cache[key] = model;
      }.bind(this));
    }
  }
  
  get(name) {
    return this.cache[name];
  }

  clone(object) {
    // Initialize model as null
    var model;

    // Recursively clone object by string name
    if (typeof object == 'string') {
      if (this.cache[object]) {
        return this.clone(this.cache[object]);
      }
    }
    else {
      // Object must exist for clone
      if (object) {
        // Utilize SkeletonUtils.js clone function
        if (object) {
          model = clone(object);
          model.animations = [...object.animations]; // Clone animations object
      
          // Add mixer animations
          this.applyUserData(model);
        }
      }
    }

    // Return new model object
    return model;
  }

  setShadows(model) {
    model.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        //child.receiveShadow = true
      }
    });
  }

  applyUserData(model) {
    // Set object properties from userData
    if (model.userData.position) { model.position.set(model.userData.position.x, model.userData.position.y, model.userData.position.z); }
    if (model.userData.rotation) { model.rotation.set(model.userData.rotation.x, model.userData.rotation.y, model.userData.rotation.z); }
    if (model.userData.scale) { model.scale.set(model.userData.scale.x, model.userData.scale.y, model.userData.scale.z); }

    // Check if animations exist
    if (model.animations.length > 0) {
      // Initialize loop type
      var loopType = (model.userData?.animation?.loop == true) ? LoopRepeat : LoopOnce; // LoopRepeat, LoopOnce
      model.mixer = new AnimationMixer(model);
      model.clips = {};

      // Add all animations (for nested models)
      for (var i = 0; i < model.animations.length; i++) {
        var animation = model.animations[i];
        var clip = model.mixer.clipAction(animation);
        clip.setLoop(loopType);
        clip.reset();
        model.clips[animation.name] = clip;
      }

      // Add basic functions
      model.animation = {
        play: function(name) { if (model.clips[name]) model.clips[name].play() },
        reset: function(name) { if (model.clips[name]) model.clips[name].reset() }
      }

      // Start animation if looping
      if (loopType == LoopRepeat) model.animation.play(model.userData?.animation?.action);
    }
  }
}

export { Models };
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone as cloneWithSkeleton } from 'three/examples/jsm/utils/SkeletonUtils';
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
        this.addMixer(model);
        this.cache[key] = model;
      }.bind(this));
    }
  }

  get(name) {
    var model = this.cache[name];
    return model;
  }

  duplicate(object) {
    // Initialize model as null
    var model;

    // Recursively clone object by string name
    if (typeof object == 'string') {
      return this.duplicate(this.get(object));
    }
    else {
      // Clone object using SkeletonUtil library
      model = cloneWithSkeleton(object);
      this.addMixer(model);
    }

    // Return new model object
    return model;
  }

  addMixer(model) {
    // Check if animations exist
    if (model.animations.length > 0) {
      model.mixer = new AnimationMixer(model);
      model.actions = {};
  
      // Add all animations (for nested models)
      for (var i = 0; i < model.animations.length; i++) {
        var animation = model.animations[i];
        var action = model.mixer.clipAction(animation);
        model.actions[animation.name] = action;
      }
  
      // Add basic functions
      model.play = function(name) {
        if (model.actions[name]) {
          var action = model.actions[name];
          action.play();
        }
      }
      model.reset = function(name) {
        if (model.actions[name]) {
          var action = model.actions[name];
          action.reset()
        }
      }
    }
  }

  updateShadows(model, castShadow = false, receiveShadow = false) {
    model.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
  }
}

export { Models };
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
// 导入 template.js（确保文件路径正确）
const template = require('./lib/template.js');

const _module_configs = {
  "Account": {
    events: ["Login_View_Show"],
    views: ["Login"],
    models: ["Account"], // 添加 models
  }
};

// Template for AccountActor.js
const actorTemplate = `import { _decorator } from "cc";
import { BaseActor } from "../../mvc/BaseActor";
import { Notification } from "../../mvc/Notification";
import { IActionHandler } from "../../core/mvc/init";
import app from "../../App";
import { UIView } from "../../config/UIConfig";

<% for (var i = 0; i < models.length; i++) { %>import <%= models[i] %>Proxy from "./<%= models[i] %>Proxy";<% } %>

<% for (var i = 0; i < views.length; i++) { %>import <%= views[i] %>Mediator from "./<%= views[i] %>Mediator";<% } %>

const { ccclass } = _decorator;
@ccclass
export class <%= name %>Actor extends BaseActor {
    public listInterests(): [string, IActionHandler][] {
        return [
            <% for (var i = 0; i < events.length; i++) { %>[Notification.<%= events[i] %>, this.execute<%= events[i] %>],
            <% } %>
        ];
    }

    public onRegister() {
        // 注册逻辑
    }

    /*---------------------------------[notices]------------------------------------*/
    <% for (var i = 0; i < events.length; i++) { %>
    public execute<%= events[i] %>(...args: any) {
        // 执行逻辑
    }
    <% } %>

    /*---------------------------------[models]------------------------------------*/
    <% for (var i = 0; i < models.length; i++) { %>
    protected get <%= models[i].toLowerCase() %>Proxy(): <%= models[i] %>Proxy {
        return app.facade.retrieveProxy(<%= models[i] %>Proxy.NAME) as <%= models[i] %>Proxy;
    }
    <% } %>

    /*---------------------------------[views]------------------------------------*/
    <% for (var i = 0; i < views.length; i++) { %>
    protected get <%= views[i].toLowerCase() %>Mediator(): <%= views[i] %>Mediator {
        return app.facade.retrieveMediator(UIView.<%= views[i] %>) as <%= views[i] %>Mediator;
    }
    <% } %>
}`;

// Template for LoginMediator.js
const mediatorTemplate = `import { _decorator } from "cc";
import BaseMediator from "../../mvc/BaseMediator";
import { IActionHandler } from "../../core/mvc/init";
const { ccclass } = _decorator;
/** 
 * <%= name %>Mediator 
 */ 
@ccclass("<%= name %>Mediator")
export default class <%= name %>Mediator extends BaseMediator {
    public listInterests(): [string, IActionHandler][] {
        return [
            // Add interested events and corresponding handlers here
            // For example: ["Login", this.handleLogin.bind(this)] 
        ];
    }
     
    protected onInitialize(): void {
        // Initialization logic
        // For example: set initial UI element states, add event listeners, etc.
    }

    protected onOpen(params: any): void {
        console.log("<%= name %>Mediator opened", params);
        // Logic for opening the UI
    }

    protected onClose(): void {
        console.log("<%= name %>Mediator closed");
        // Logic for closing the UI
        // For example: clear temporary data, etc.
    }

    protected onDestroy(): void {
        console.log("<%= name %>Mediator destroyed");
        // Clean up resources
        // For example: release occupied memory, etc.
    }
}`;

// Template for AccountProxy.js
const proxyTemplate = `import { _decorator } from "cc";
import BaseProxy from "../../mvc/BaseProxy";
const { ccclass } = _decorator;

@ccclass
export default class <%= name %>Proxy extends BaseProxy {
    public static NAME = "<%= name %>"
}`;

// Template for modules.js
const modulesTemplate = `export const modules = [
    <% for (var i = 0; i < modules.length; i++) { %>"<%= modules[i] %>",
    <% } %>
]`;

// Template for Notification.js
const notificationTemplate = `/** 
* 自动生成的文件,不要操作 
*/ 
export const Notification = {
    <% for (var i = 0; i < events.length; i++) { %><%= events[i] %> : "<%= events[i] %>",
    <% } %>EOF:"EOF"
}`;


async function writeFileIfNotExists(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    }
  
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
    } else {
      // 使用 Prettier 格式化代码
      try {
       
        
        // 移除多余的 @@ 符号
        const cleanContent = content.replace(/@@/g, '\n');


        const formattedContent = await prettier.format(cleanContent, {
            semi: false,
            parser: "typescript",
          });
        
        fs.writeFileSync(filePath, formattedContent);
        console.log(`File generated and formatted: ${filePath}`);
      } catch (error) {
        console.error(`Error formatting file ${filePath}:`, error);
        // 如果格式化失败,写入原始内容
        fs.writeFileSync(filePath, content);
        console.log(`File generated without formatting: ${filePath}`);
      }
    }
  }
  
  // 修改 generateTemplates 函数为异步函数
  async function generateTemplates(config, outputPath, mvcPath) {
    const allModules = [];
    const allEvents = [];
  
    for (const [name, moduleConfig] of Object.entries(config)) {
      allModules.push(name);
      allEvents.push(...moduleConfig.events);
  
      const models = moduleConfig.models || [name];
  
      const actorRendered = template(actorTemplate)({ name, ...moduleConfig, models });
      const actorPath = path.join(outputPath, `${name}Actor.ts`);
      await writeFileIfNotExists(actorPath, actorRendered);
  
      for (const view of moduleConfig.views) {
        const mediatorRendered = template(mediatorTemplate)({ name: view });
        const mediatorPath = path.join(outputPath, `${view}Mediator.ts`);
        await writeFileIfNotExists(mediatorPath, mediatorRendered);
      }
  
      for (const model of models) {
        const proxyRendered = template(proxyTemplate)({ name: model });
        const proxyPath = path.join(outputPath, `${model}Proxy.ts`);
        await writeFileIfNotExists(proxyPath, proxyRendered);
      }
    }
  
    const modulesRendered = template(modulesTemplate)({ modules: allModules });
    const modulesPath = path.join(mvcPath, 'modules.ts');
    await writeFileIfNotExists(modulesPath, modulesRendered);
  
    const notificationRendered = template(notificationTemplate)({ events: allEvents });
    const notificationPath = path.join(mvcPath, 'Notification.ts');
    await writeFileIfNotExists(notificationPath, notificationRendered);
  }
  
  // 使用异步 IIFE 来运行生成模板的代码
  (async () => {
    try {
      await generateTemplates(_module_configs, 
                        path.join(__dirname, 'account'), 
                        path.join(__dirname, 'mvc'));
      console.log("All templates generated successfully.");
    } catch (error) {
      console.error("Error generating templates:", error);
    }
  })();
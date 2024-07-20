const fs = require('fs');
const path = require('path');
const template = require('./lib/template.js');
const prettier = require('prettier');

const _module_configs = {
  "Account": {
    events: ["Login_View_Show","Logout_View_Hide"],
    views: ["Login"],
    models: ["Account","User"],
  }
};


function readTemplate(templateName) {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.tpl`);
    return fs.readFileSync(templatePath, 'utf-8');
}


const actorTemplate = readTemplate('actorTemplate');
const mediatorTemplate = readTemplate('mediatorTemplate');
const proxyTemplate = readTemplate('proxyTemplate');
const modulesTemplate = readTemplate('modulesTemplate');
const notificationTemplate = readTemplate('notificationTemplate');


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

async function updateFile(filePath, content) {
  // 使用 Prettier 格式化代码
  try {
    const cleanContent = content.replace(/@@/g, '\n');
    const formattedContent = await prettier.format(cleanContent, {
      semi: false,
      parser: "typescript",
    });
    
    fs.writeFileSync(filePath, formattedContent);
    console.log(`File updated and formatted: ${filePath}`);
  } catch (error) {
    console.error(`Error formatting file ${filePath}:`, error);
    // 如果格式化失败,写入原始内容
    fs.writeFileSync(filePath, content);
    console.log(`File updated without formatting: ${filePath}`);
  }
}

async function updateActorFile(filePath, newConfig) {
  if (!fs.existsSync(filePath)) {
    // 如果文件不存在，直接创建新文件
    const actorRendered = template(actorTemplate)(newConfig);
    await writeFileIfNotExists(filePath, actorRendered);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 解析现有文件
  const existingModels = (content.match(/get (\w+)Proxy/g) || []).map(m => m.replace('get ', '').replace('Proxy', ''));
  const existingViews = (content.match(/get (\w+)Mediator/g) || []).map(m => m.replace('get ', '').replace('Mediator', ''));
  const existingEvents = (content.match(/execute(\w+)/g) || []).map(m => m.replace('execute', ''));

  // 找出需要添加的新内容
  const newModels = newConfig.models.filter(m => !existingModels.includes(m));
  const newViews = newConfig.views.filter(v => !existingViews.includes(v));
  const newEvents = newConfig.events.filter(e => !existingEvents.includes(e));

  // 生成新的内容
  let newNoticesContent = '';
  let newModelsContent = '';
  let newViewsContent = '';

  if (newEvents.length > 0) {
    newEvents.forEach(event => {
      if (!existingEvents.includes(event)) {
        newNoticesContent += `
    public execute${event}(...args: any) {
        // 执行逻辑
    }
`;
      }
    });
  }

  if (newModels.length > 0) {
    newModels.forEach(model => {
      if (!existingModels.includes(model)) {
        newModelsContent += `
    protected get ${model.toLowerCase()}Proxy(): ${model}Proxy {
        return app.facade.retrieveProxy(${model}Proxy.NAME) as ${model}Proxy;
    }
`;
      }
    });
  }

  if (newViews.length > 0) {
    newViews.forEach(view => {
      if (!existingViews.includes(view)) {
        newViewsContent += `
    protected get ${view.toLowerCase()}Mediator(): ${view}Mediator {
        return app.facade.retrieveMediator(UIView.${view}) as ${view}Mediator;
    }
`;
      }
    });
  }

  // 在文件指定位置添加新内容
  if (newNoticesContent || newModelsContent || newViewsContent) {
    content = content.replace(/(\/\*---------------------------------\[notices\]------------------------------------\*\/)/, `$1${newNoticesContent}`);
    content = content.replace(/(\/\*---------------------------------\[models\]------------------------------------\*\/)/, `$1${newModelsContent}`);
    content = content.replace(/(\/\*---------------------------------\[views\]------------------------------------\*\/)/, `$1${newViewsContent}`);
    
    // 格式化并写入文件
    const formattedContent = await prettier.format(content, {
      semi: false,
      parser: "typescript",
    });
    
    fs.writeFileSync(filePath, formattedContent);
    console.log(`Actor file updated: ${filePath}`);
  } else {
    console.log(`No updates needed for Actor file: ${filePath}`);
  }
}

async function generateTemplates(config, outputPath, mvcPath) {
    const allModules = [];
    const allEvents = [];
  
    for (const [name, moduleConfig] of Object.entries(config)) {
      allModules.push(name);
      allEvents.push(...moduleConfig.events);
  
      const models = moduleConfig.models || [name];
  
      const actorPath = path.join(outputPath, `${name}Actor.ts`);
      await updateActorFile(actorPath, { name, ...moduleConfig, models });
  
      for (const view of moduleConfig.views) {
        const mediatorRendered = template(mediatorTemplate, { name: view });
        const mediatorPath = path.join(outputPath, `${view}Mediator.ts`);
        await writeFileIfNotExists(mediatorPath, mediatorRendered);
      }
  
      for (const model of models) {
        const proxyRendered = template(proxyTemplate, { name: model });
        const proxyPath = path.join(outputPath, `${model}Proxy.ts`);
        await writeFileIfNotExists(proxyPath, proxyRendered);
      }
    }
  
    const modulesRendered = template(modulesTemplate, { modules: allModules });
    const modulesPath = path.join(mvcPath, 'modules.ts');
    await updateFile(modulesPath, modulesRendered);
  
    const notificationRendered = template(notificationTemplate, { events: allEvents });
    const notificationPath = path.join(mvcPath, 'Notification.ts');
    await updateFile(notificationPath, notificationRendered);
  }
  

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

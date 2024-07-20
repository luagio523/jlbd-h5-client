const fs = require('fs');
const path = require('path');
const template = require('./lib/template.js');
const prettier = require('prettier');

const _module_configs = {
  "Account": {
    events: ["Login_View_Show","Logout_View_Show","Role_View_Show","User_View_Show","User_View_Hide","User_View_Show_Role_List","User_View_Show_Role_Detail","User_View_Show_Role_Create","User_View_Show_Role_Edit","User_View_Show_Role_Delete","User_View_Show_Role_Save","User_View_Show_Role_Cancel","User_View_Show_Role_Delete_Confirm","User_View_Show_Role_Delete_Cancel","User_View_Show_Role_Delete_Confirm_OK","User_View_Show_Role_Delete_Confirm_Cancel","User_View_Show_Role_Delete_Confirm_OK_OK","User_View_Show_Role_Delete_Confirm_OK_Cancel","User_View_Show_Role_Delete_Confirm_Cancel_OK","User_View_Show_Role_Delete_Confirm_Cancel_Cancel","User_View_Show_Role"],
    views: ["Login","Role"],
    models: ["Account","User","Role"],
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
		useTabs: true
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
	  useTabs: true
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
  const newModels = newConfig.models.filter(m => !existingModels.includes(m.toLowerCase()));
  const newViews = newConfig.views.filter(v => !existingViews.includes(v.toLowerCase()));
  const newEvents = newConfig.events.filter(e => !existingEvents.includes(e));

	if(newModels.length>0){	
		console.log(`New models: ${newModels}`);
	}
	if(newViews.length>0){
		console.log(`New views: ${newViews}`);
		}
	if(newEvents.length>0){
		console.log(`New events: ${newEvents}`);
	}
	// 更新 listInterests 方法
	  // 更新 listInterests 方法
	  if (newEvents.length > 0) {
		const listInterestsRegex = /public\s+listInterests\(\)[\s\S]*?\{[\s\S]*?return\s*\[([\s\S]*?)\]\s*;?\s*\}/;
		const match = content.match(listInterestsRegex);
		if (match) {
			let existingInterests = match[1].trim().split('\n')
				.map(line => line.trim())
				.filter(line => line !== '' && line !== ',' && !line.startsWith('//'))
				.map(line => line.replace(/,$/, ''));  // Remove trailing commas
			
			const newInterests = newEvents.map(event => `[Notification.${event}, this.execute${event}]`);
			const allInterests = existingInterests.concat(newInterests);
			
			const updatedInterests = allInterests.join(',\n\t\t\t');
	
			console.log(`Existing interests: ${JSON.stringify(existingInterests)}`);
			console.log(`New interests: ${JSON.stringify(newInterests)}`);
			console.log(`All interests: ${JSON.stringify(allInterests)}`);
			console.log(`Updated interests: ${updatedInterests}`);
	
			content = content.replace(listInterestsRegex, `public listInterests(): [string, IActionHandler][] {
			return [
				${updatedInterests}
			];
		}`);
		}
	}
	

  

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
	  useTabs: true
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

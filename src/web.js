export default function () {
  twemoji.base = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/2.4/2/';
  window.onload = function () {
    new ClipboardJS('.copyBtn', {
      text: (trigger) => {
        return trigger.dataset.clipboardText;
      }
    });
    new tippy('body', {
      target: '.tippy'
    });
    new tippy('body', {
      target: '.tippy-r',
      placement: 'right'
    });
    new tippy('body', {
      target: '.tippy-l',
      placement: 'left'
    });
    new tippy('body', {
      target: '.tippy-b-lg',
      placement: 'bottom',
      size: 'large'
    });
  };
  window.es = new EventSource(baseURL + '/stream');
  var rolesCache = [];
  var usersCache = [];
  var channelsCache = [];
  es.onmessage = ev => {
    let data = JSON.parse(ev.data);
    rolesCache.push(...data.roles);
    usersCache.push(...data.users);
    channelsCache.push(...data.channels);
  }
  function rgba (hex, opacity) {
    let rgb = hex.split(/(..)/).filter(Boolean).map(e => parseInt(e, 16))
    return `rgba(${[...rgb, opacity].join(',')})`
  }
  var rules = {
    emoji: {
      order: 12,
      match: function (source, state, lookbehind) {
        return /^<(a?):(\w+):(\d+)>/.exec(source);
      },
      parse: function (capture, recurseParse, state) {
        return {
          name: capture[2],
          id: capture[3],
          animated: Boolean(capture[1])
        };
      },
      html: function (node, recurseOutput) {
        return `<img class="emoji tippy" alt=":${node.name}:" title=":${node.name}:"`
          + `src="https://cdn.discordapp.com/emojis/${node.id}.${node.animated ? 'gif' : 'png'}">`;
      }
    },
    codeBlock: {
      order: 4,
      match: function (source, state, lookbehind) {
        return /^```(?:([a-z0-9]+)\n)?\s*([\s\S]+?)\s*```/i.exec(source);
      },
      parse: function (capture, recurseParse, state) {
        return {
          lang: capture[1],
          code: capture[2].replace(/\n\n/g, '\n')
        };
      },
      html: function (node, recurseOutput) {
        return `<pre>${SimpleMarkdown.sanitizeText(node.code)}</pre>`;
      }
    },
    tag: {
      order: 13,
      match: function (source, state, lookbehind) {
        return /^<(@[&!]?|#)(\d+)>|^@(everyone|here)/.exec(source);
      },
      parse: function (capture, recurseParse, state) {
        let name, color
        switch (capture[1]) {
          case '@&':
            let role = rolesCache.find(r => r.id === capture[2]);
            if (role) {
              name = role.name
              color = role.color
            }
            break
          case '@': case '@!':
            if (capture[2] === '1')
              name = 'Clyde#0000';
            let user = usersCache.find(u => u.id === capture[2]);
            if (user)
              name = `${user.name}#${user.discrim}`
            break
          case '#':
            let channel = channelsCache.find(c => c.id === capture[2]);
            if (channel)
              name = channel.name
            break
        }
        let parsed = {
          code: capture[1],
          id: capture[2],
          name: name || null,
          color: color
        };
        if (capture[3]) {
          parsed.name = capture[3]
          parsed.code = '@'
        }
        return parsed
      },
      html: function (node, recurseOutput) {
        let style = ''
        if (node.color) {
          let hex = node.color.toString(16).padStart(6, '0')
          style = 'style="'
            + `background: ${rgba(hex,.1)};`
            + `color: #${hex};"`
        }
        if (node.name)
          return `<span class="tag"${style}>${node.code[0]}${node.name}</span>`
        return `<span class="tag"><${node.code}${node.id}></span>`;
      }
    },
    del: SimpleMarkdown.defaultRules.del,
    em: SimpleMarkdown.defaultRules.em,
    escape: SimpleMarkdown.defaultRules.escape,
    inlineCode: SimpleMarkdown.defaultRules.inlineCode,
    paragraph: SimpleMarkdown.defaultRules.paragraph,
    strong: SimpleMarkdown.defaultRules.strong,
    text: SimpleMarkdown.defaultRules.text,
    u: SimpleMarkdown.defaultRules.u,
    autolink: {
      order: 13,
      match: function (source, state, lookbehind) {
        return /^https?:\/\/([a-z0-9\-]+\.)*[a-z0-9\-]+(\.[a-z]{2,6}){1,2}(:\d{1,5})?(\/[!-;=?-~]*)*/i.exec(source);
      },
      parse: function (capture, recurseParse, state) {
        if (capture[0].match(/\//g).length < 3)
          capture[0] += '/';
        return {
          content: capture[0]
        };
      },
      html: function (node, recurseOutput) {
        let url = node.content.replace(/%20/g, ' ')
        return `<a href="${node.content}" target="_blank">${encodeURI(url)}</a> `;
      }
    },
  }
  var rawBuiltParser = SimpleMarkdown.parserFor(rules);
  var parse = function(source) {
      var blockSource = source + '\n\n';
      return rawBuiltParser(blockSource, {inline: false});
  };
  var htmlOutput = SimpleMarkdown.htmlFor(SimpleMarkdown.ruleOutput(rules, 'html'));
  window.processMarkdown = function (text) {
    var syntaxTree = parse(text);
    return htmlOutput(syntaxTree);
  }
}
